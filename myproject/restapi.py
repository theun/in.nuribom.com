# -*- coding: utf-8 -*- 

from bson import ObjectId
from json import JSONEncoder

from .blog import get_time_ago
from .blog import AlarmMessage
from .models import *
from .search import FTS_engine 
from .views import log, get_remember, set_remember, reset_remember, image_thumbnail_info

from datetime import datetime
from pyramid.exceptions import NotFound
from pyramid.httpexceptions import HTTPFound
from pyramid.response import Response
from pyramid.security import (
    remember,
    forget,
    authenticated_userid)
from pyramid.view import view_config

# REST API
class RestAPI(object):
    def __init__(self, request):
        self.request = request
    
    def me(self):
        return User.by_username(authenticated_userid(self.request))

    def getLoginResult(self, me):
        data = me.toJSON({"include": ["id", "name", "username", "permissions", "groups"]})

        data["alarms"] = [alarm.toJSON({"include": ["id", "checked", "who", "created", "text"]}) 
                          for alarm in me.alarms if not alarm.checked or (datetime.now() - alarm.created).days < 7][::-1]
        for alarm in data["alarms"]:
            alarm["who"] = alarm["who"].username
            alarm["created"] = get_time_ago(alarm["created"])

        return data
    
    # /rest/login
    @view_config(route_name="rest_login")
    def login(self):
        data = {}
        method = self.request.method

        #log.debug("REST/LOGIN: %s", method)
        if method == "GET":         # get remember me information
            me = get_remember(self.request)
            #log.debug("REST/LOGIN: %s", me)
            
            data = self.getLoginResult(me) if me else {"id": None}
                
        elif method == "POST":      # login
            json = self.request.json_body
            #log.debug("REST/LOGIN: %s", json)

            login = json['username']
            password = json['password']
            remember_me = json['remember']
            
            user = User.by_username(login)
            if user and user.validate_password(password):
                headers = remember(self.request, login)
                self.request.response.headerlist.extend(headers)
    
                if remember_me == 'yes' :
                    set_remember(self.request, str(user.id))
                else:
                    reset_remember(self.request)
                
                data = self.getLoginResult(user)
            else:
                data = {"id": None}
                
        elif method == "DELETE":    # logout
            headers = forget(self.request)
            reset_remember(self.request)
            #log.debug("REST/LOGIN: %s", authenticated_userid(self.request))
            self.request.response.headerlist.extend(headers)
            return HTTPFound(location=self.request.route_path('home'),
                             headers=self.request.response.headers)
                
        return Response(JSONEncoder().encode(data))
        
            
    def getPost(self, param):
        try:
            pid = ObjectId(self.request.matchdict[param])
            post = Post.objects.with_id(pid)
        except:
            raise NotFound
        
        return post
    
    def getBlogResult(self, post):
        data = post.toJSON({"exclude": ["published", "tags", "files", "comments", "likes"]})
        data["author"] = dict(
            name=post.author.name,
            username=post.author.username)
        data["category"] = dict(
            id=str(post.category.id),
            name=post.category.name,
            owner=post.category.owner.username
        ) if data["category"] else dict(name=u"새소식")
        data["isLike"] = self.me() in post.likes
        data["modified"] = get_time_ago(data["modified"])
        data["images"] = [dict(image_thumbnail_info(image.split("/")[-1]), **{"url": image}) for image in data["images"][:3]]
        data["images_len"] = len(post.images)
        return data
        
    # /rest/blog
    @view_config(route_name='rest_blogs',
                 permission='blog:view')
    def blogs(self):
        data = {}
        method = self.request.method
        
        #log.debug("REST/BLOGS: %s", method)
        if method == "GET":     # Read
            json = self.request.params
            page = int(self.request.params.get('page', '1')) - 1
            page_size = int(self.request.params.get('page_size', '25'))
            gid = self.request.params.get('gid', '')
            
            #log.debug("REST/BLOGS: data - %s", json)
            if gid:
                me = self.me()
                group = Category.objects.with_id(ObjectId(gid))
                if group and (group.public or group.owner == me or me in group.members):
                    posts = Post.objects(category=group).order_by('-modified')[page*page_size:(page+1)*page_size]
                else:
                    posts = []
            else:
                posts = Post.objects(category=None).order_by('-modified')[page*page_size:(page+1)*page_size]
            data = [self.getBlogResult(post) for post in posts]
        elif method == "POST":  # Create
            json = self.request.json_body
            #log.debug("REST/BLOG: %s", json)

            author = User.by_username(json["username"])
            content = json["tx_content"].replace("'", "&#39;").replace("\r\n", "")
            post = Post(title=json["title"],
                        modified=datetime.now(),
                        content=content,
                        author=author)
            
            for attach in json["tx_attach_image"]:
                post.images.append(attach)
            for attach in json["tx_attach_file"]:
                post.files.append(attach)
            
            post.save(safe=True)
            
            # 내가 새글을 추가한 경우, 나를 제외한 블로그 그룹의 모든 사람에게 알람을 전송한다.
            msg = AlarmMessage(me=self.me(), command=AlarmMessage.CMD_BLOG_ADD, post=post)
            thread_alarmer.send(msg)

            data = self.getBlogResult(post)
        else:
            log.error("REST/BLOG: unknown method('%s')", method)
            
        return Response(JSONEncoder().encode(data))

    # /rest/blog/{id}
    @view_config(route_name='rest_blog',
                 permission='blog:view')
    def blog(self):
        data = {}
        post = self.getPost('id')
        method = self.request.method
        
        #log.debug("REST/BLOG: %s", method)
        if method == "GET":     # Read
            data = self.getBlogResult(post)
        elif method == "POST":  # Create
            json = self.request.json_body
            #log.debug("REST/BLOG: %s", json)

            author = User.by_username(json["username"])
            content = json["tx_content"].replace("'", "&#39;").replace("\r\n", "")
            post = Post(title=json["title"],
                        modified=datetime.now(),
                        content=content,
                        author=author)
            
            for attach in json["tx_attach_image"]:
                post.images.append(attach)
            for attach in json["tx_attach_file"]:
                post.files.append(attach)
            
            post.save(safe=True)
            
            # 내가 새글을 추가한 경우, 나를 제외한 블로그 그룹의 모든 사람에게 알람을 전송한다.
            msg = AlarmMessage(me=self.me(), command=AlarmMessage.CMD_BLOG_ADD, post=post)
            thread_alarmer.send(msg)
            
            data = self.getBlogResult(post)
        elif method == "PUT":   # Update
            json = self.request.json_body
            #log.debug("REST/BLOG: data - %s", json)

            post.title = json["title"]
            post.content = json["tx_content"].replace("'", "&#39;").replace("\r\n", "")
            post.modified = datetime.now()
            post.author = User.by_username(json["username"])
            
            if "tx_attach_image" in json:
                for url in json["tx_attach_image"]:
                    if url not in post.images:
                        post.images.append(url)
                for url in post.images[:]:
                    if url not in json["tx_attach_image"]:
                        # 이미지 삭제
                        fid = url.split('/')[-1]
                        fs_images.delete(fid)
                        post.images.remove(url)
            else:
                for url in post.images[:]:
                    fid = url.split('/')[-1]
                    fs_images.delete(fid)
                    post.images.remove(url)
                
            if "tx_attach_file" in json:
                for url in json["tx_attach_file"]:
                    if url not in post.files:
                        post.files.append(url)
                for url in post.files[:]:
                    if url not in json["tx_attach_file"]:
                        # 파일 삭제
                        fid = url.split('/')[-1]
                        fs_files.delete(fid)
                        post.files.remove(url)
            else:
                for url in post.files[:]:
                    fid = url.split('/')[-1]
                    fs_files.delete(fid)
                    post.files.remove(url)
                
            post.save(safe=True)

            # 내가 글을 수정한 경우, 나를 제외한 블로그 그룹의 모든 사람에게 알람을 전송한다.
            msg = AlarmMessage(me=post.author, command=AlarmMessage.CMD_BLOG_EDIT, post=post)
            thread_alarmer.send(msg)
        elif method == "DELETE":    # Delete
            post.delete(safe=True)
        elif method == "PATCH":     # Patch : 특정 항목만 업데이트 한다.
            json = self.request.json_body
            #log.debug("REST/BLOG: data - %s", json)
            if "isLike" in json:
                me = self.me()
                if me not in post.likes and json["isLike"]:
                    post.likes.append(me)
                elif me in post.likes and not json["isLike"]:
                    post.likes.remove(me)
            
                post.save()
        else:
            log.error("REST/BLOG: unknown method('%s')", method)
            
        return Response(JSONEncoder().encode(data))

    def getGroup(self, param):
        try:
            gid = ObjectId(self.request.matchdict[param])
            group = Category.objects.with_id(gid)
        except:
            raise NotFound
        
        return group
    
    def getGroupResult(self, group):
        data = group.toJSON()
        data['owner'] = { 'username': group.owner.username }
        data['members'] = [dict(name=member.name, username=member.username)
                           for member in group.members]
        return data
    
    # /rest/group/{id}
    @view_config(route_name='rest_group',
                 permission='blog:view')
    def group(self):
        data = {}
        group = self.getGroup('gid')
        method = self.request.method
        
        #log.debug("REST/BLOG: %s", method)
        if method == "GET":     # Read
            data = self.getGroupResult(group)
        elif method == "POST":  # Create
            json = self.request.json_body
            #log.debug("REST/BLOG: %s", json)

            author = User.by_username(json["username"])
            content = json["tx_content"].replace("'", "&#39;").replace("\r\n", "")
            post = Post(title=json["title"],
                        modified=datetime.now(),
                        content=content,
                        author=author)
            
            for attach in json["tx_attach_image"]:
                post.images.append(attach)
            for attach in json["tx_attach_file"]:
                post.files.append(attach)
            
            post.save(safe=True)
            
            # 내가 새글을 추가한 경우, 나를 제외한 블로그 그룹의 모든 사람에게 알람을 전송한다.
            msg = AlarmMessage(me=self.me(), command=AlarmMessage.CMD_BLOG_ADD, post=post)
            thread_alarmer.send(msg)
            
            data = self.getBlogResult(post)
        elif method == "PUT":   # Update
            json = self.request.json_body
            #log.debug("REST/BLOG: data - %s", json)

            post.title = json["title"]
            post.content = json["tx_content"].replace("'", "&#39;").replace("\r\n", "")
            post.modified = datetime.now()
            post.author = User.by_username(json["username"])
            
            if "tx_attach_image" in json:
                for url in json["tx_attach_image"]:
                    if url not in post.images:
                        post.images.append(url)
                for url in post.images[:]:
                    if url not in json["tx_attach_image"]:
                        # 이미지 삭제
                        fid = url.split('/')[-1]
                        fs_images.delete(fid)
                        post.images.remove(url)
            else:
                for url in post.images[:]:
                    fid = url.split('/')[-1]
                    fs_images.delete(fid)
                    post.images.remove(url)
                
            if "tx_attach_file" in json:
                for url in json["tx_attach_file"]:
                    if url not in post.files:
                        post.files.append(url)
                for url in post.files[:]:
                    if url not in json["tx_attach_file"]:
                        # 파일 삭제
                        fid = url.split('/')[-1]
                        fs_files.delete(fid)
                        post.files.remove(url)
            else:
                for url in post.files[:]:
                    fid = url.split('/')[-1]
                    fs_files.delete(fid)
                    post.files.remove(url)
                
            post.save(safe=True)

            # 내가 글을 수정한 경우, 나를 제외한 블로그 그룹의 모든 사람에게 알람을 전송한다.
            msg = AlarmMessage(me=post.author, command=AlarmMessage.CMD_BLOG_EDIT, post=post)
            thread_alarmer.send(msg)
        elif method == "DELETE":    # Delete
            post.delete(safe=True)
        elif method == "PATCH":     # Patch : 특정 항목만 업데이트 한다.
            json = self.request.json_body
            #log.debug("REST/BLOG: data - %s", json)
            if "isLike" in json:
                me = self.me()
                if me not in post.likes and json["isLike"]:
                    post.likes.append(me)
                elif me in post.likes and not json["isLike"]:
                    post.likes.remove(me)
            
                post.save()
        else:
            log.error("REST/BLOG: unknown method('%s')", method)
            
        return Response(JSONEncoder().encode(data))

    def getLikeResult(self, like):
        return dict(id       = str(like.id),
                    name     = like.name,
                    username = like.username)
        
    # /rest/blog/{bid}/like
    @view_config(route_name='rest_blog_likes',
                 permission='blog:view')
    def likes(self):
        data   = {}
        post   = self.getPost('bid')
        method = self.request.method
         
        #log.debug("REST/BLOG/LIKES: %s", method)
        if method == 'GET':     # Read Collection
            #log.debug("REST/BLOG/LIKES: likes = %d", len(post.likes))
            data = [self.getLikeResult(like) for like in post.likes]
        elif method == 'POST':  # Create Model
            json = self.request.json_body
            #log.debug("REST/BLOG/LIKES: data - %s", json)
            
            like = User.by_username(json["username"])
            post.likes.append(like)
            post.save(safe=True)
            data = self.getLikeResult(like)
        else:
            log.error("REST/BLOG/LIKES: unknown method('%s')", method) 

        return Response(JSONEncoder().encode(data))

    # /rest/blog/{bid}/like/{id}
    @view_config(route_name='rest_blog_like',
                 permission='blog:view')
    def like(self):
        data = {}
        post = self.getPost('bid')
        like = User.objects.with_id(ObjectId(self.request.matchdict['id']))
        method = self.request.method

        #log.debug("REST/BLOG/LIKE: %s", method)
        if method == "GET":         # Read Model
            data = self.getLikeResult(like)
        elif method == "DELETE":    # Delete Model
            post.likes.remove(like)
            post.save(safe=True)
        elif method == "PUT":       # Insert
            if like not in post.likes:
                post.likes.append(like)
                post.save(safe=True)
        else:
            log.error("REST/BLOG/LIKES: unknown method('%s')", method) 
            
        return Response(JSONEncoder().encode(data))

    def getCommentResult(self, comment):
        return dict(author = dict(id       = str(comment.author.id),
                                  name     = comment.author.name,
                                  username = comment.author.username),
                    content = comment.content,
                    id = str(comment.id),
                    posted = get_time_ago(comment.posted) )

    # /rest/blog/{bid}/comment
    @view_config(route_name='rest_blog_comments',
                 permission='blog:view')
    def comments(self):
        data = {}
        post = self.getPost('bid')
        method = self.request.method
         
        #log.debug("REST/BLOG/COMMENTS: %s", method)
        if method == 'GET':     # Read Comments
            #log.debug("REST/BLOG/LIKES: comments = %d", len(post.comments))
            data = [self.getCommentResult(comment) for comment in post.comments]
        elif method == 'POST':  # Create Comment
            json = self.request.json_body
            #log.debug("REST/BLOG/COMMENTS: data - %s", json)
            
            author = User.by_username(json["author"]["username"])
            comment = Comment(content=json["comment"], author=author)
            comment.save(safe=True)
            post.comments.append(comment)
            post.save(safe=True)
            
            # 내가 댓글을 추가한 경우, 나를 제외한 블로그 작성자나 댓글 작성자, 좋아요 사용자에게 알람을 전송한다.
            msg = AlarmMessage(me=self.me(), command=AlarmMessage.CMD_BLOG_COMMENT, post=post)
            thread_alarmer.send(msg)
            
            data = self.getCommentResult(comment)
        else:
            log.error("REST/BLOG/COMMENTS: unknown method('%s')", method) 

        return Response(JSONEncoder().encode(data))
    
    # /rest/blog/{bid}/comment/{id}
    @view_config(route_name='rest_blog_comment',
                 permission='blog:view')
    def comment(self):
        data = {}
        post = self.getPost('bid')
        method = self.request.method
        comment = Comment.objects.with_id(ObjectId(self.request.matchdict["id"]))
        
        #log.debug("REST/BLOG/COMMENT: %s", method)
        if method == 'GET':     # Read Comment
            data = self.getCommentResult(comment)
        elif method == "PUT":   # Update Comment
            json = self.request.json_body
            #log.debug("REST/BLOG/COMMENT: data - %s", json)

            comment.content = json["comment"]
            comment.posted = datetime.now() 
            comment.save(safe=True)
            
            data = self.getCommentResult(comment)
        elif method == "DELETE":# Delete Comment
            post.comments.remove(comment)
            post.save(safe=True)
            comment.delete(safe=True)
        else:
            log.error("REST/BLOG/COMMENT: unknown method('%s')", method) 
            
        return Response(JSONEncoder().encode(data))

    # /rest/search/{query}/{page}
    @view_config(route_name='rest_search', request_method='GET', permission='blog:view')
    def search(self):
        page = int(self.request.params.get('page', '1')) - 1
        page_size = int(self.request.params.get('page_size', '25'))
        query = self.request.matchdict.get('query', '')
        results = []
        
        #log.debug("REST/SEARCH: method=%s, query=%s, page=%s, page_size=%s", self.request.method, query, page, page_size)

        if query:
            fts = FTS_engine()
        
            # 내 블로그 그룹을 찾는다.
            me = self.me()
            mygroup = [str(c.id) for c in Category.objects(Q(public=False)&(Q(owner=me)|Q(members=me)))]
            
            results = fts.search(query, collections=mygroup, start=page*page_size, rows=page_size)
            
            for result in results:
                if result["collection"] == "User":
                    user = User.objects.with_id(ObjectId(result["id"]))
                    result["user"] = user.toJSON({"include": ["username", "name", "email", "mobile", "phone"]})
                    result["user"]["team"] = dict(id=str(Team.objects(name=user.team).first().id), path=user.get_team_path())
                    result["user"]["rank"] = user.get_rank().strip("-0123456789")
                else:
                    post = Post.objects.with_id(ObjectId(result["id"]))
                    result["blog"] = self.getBlogResult(post)
            
            #log.debug("Search Result : %d", len(results))
            return Response(JSONEncoder().encode(results))
        else:
            return {}
        