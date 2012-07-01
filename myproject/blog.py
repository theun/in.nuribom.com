# -*- coding: utf-8 -*- 

import sys
import json
import logging
import mimetypes

from bson import ObjectId

from pyramid.httpexceptions import (
    HTTPFound,
    HTTPNotFound
    )

from pyramid.exceptions import NotFound
from pyramid.view import (
    view_config,
    forbidden_view_config,
    )
from pyramid.security import authenticated_userid
from pyramid.response import Response

from .models import *
from mongoengine.fields import GridFSProxy
from datetime import datetime

from .views import log

PAGE_ITEMS = 10

class AlarmMessage(object):
    CMD_BLOG_ADD = "blog-add"
    CMD_BLOG_EDIT = "blog-edit"
    CMD_BLOG_COMMENT = "comment-add"
    CMD_BLOG_LIKE_IT = "like-it"
    CMD_GROUP_ADD = "group-add"
    CMD_GROUP_MEMBER_ADD = "group-member-add"
    
    def __init__(self, **kwargs):
        for key in kwargs:
            setattr(self, key, kwargs[key])
    

def get_time_ago(time):
    time_ago = u""
    delta = datetime.now() - time
    
    if delta.days == 0:
        delta_seconds = int(delta.total_seconds())
        delta_minutes = delta_seconds / 60
        delta_hours = delta_minutes / 60
        if delta_hours > 0:
            time_ago += u"%d시간 전" % delta_hours
        else:
            time_ago += u"%d분 전" % delta_minutes
    else:
        if delta.days == 1:
            time_ago += u"어제"
        elif delta.days < time.weekday():
            time_ago += weekday[time.weekday()]
        else:
            if datetime.now().year != time.year:
                time_ago += u"%d년 " % time.year
                
            time_ago += u"%d월 %d일" % (time.month, time.day)
        
        time_ago += u" %s %d:%d" % (u"오전" if time.hour < 12 else u"오후",
                                  time.hour,
                                  time.minute)
        
    return time_ago

class BlogView(object):
    
    def __init__(self, request):
        self.request = request
    
    def permit(self, user, post):
        if not post.category or post.category.public:
            return True
        
        if post.category in Category.objects(Q(public=False)&(Q(owner=user)|Q(members=user))):
            return True
        
        return False
        
    @view_config(route_name='blog_list', 
                 renderer='blog/blog_list.mako', 
                 permission='blog:view')
    def blog_list(self):
        return dict(posts=Post.objects(category=None).order_by('-modified'), 
                    group=None)

    @view_config(route_name='blog_view', 
                 renderer='blog/blog_view.mako', 
                 permission='blog:view')
    def blog_view(self):
        try:
            blog_id = ObjectId(self.request.matchdict['id'])
            post = Post.objects.with_id(blog_id)
            me = User.by_username(authenticated_userid(self.request))
            if not self.permit(me, post):
                raise NotFound
        except:
            raise NotFound
        
        if self.request.method == "POST":
            start = int(self.request.params['start'])
            end   = start + 10 if (start + 10) < len(post.images) else len(post.images) 
            return Response(json.JSONEncoder().encode({'list': post.images[start:end]}))
        else:
            return dict(post=post)
    
    @view_config(route_name='blog_edit', 
                 renderer='blog/blog_post.mako', 
                 permission='blog:edit')
    def blog_edit(self):
        try:
            blog_id = ObjectId(self.request.matchdict['id'])
            post = Post.objects.with_id(blog_id)
            me = User.by_username(authenticated_userid(self.request))
            if not self.permit(me, post):
                raise NotFound
        except:
            raise NotFound
    
        if self.request.method == 'POST':
            log.warn(self.request.POST)
            post.title = self.request.POST['title']
            post.content = self.request.POST['tx_content'].replace("'", "&#39;").replace("\r\n", "")
            post.modified = datetime.now()
            post.author = me

            if 'tx_attach_image' in self.request.POST:
                for url in self.request.POST.getall('tx_attach_image'):
                    if url not in post.images:
                        post.images.append(url)
                for url in post.images[:]:
                    if url not in self.request.POST.getall('tx_attach_image'):
                        # 이미지 삭제
                        id = url.split('/')[-1]
                        fs_images.delete(id)
                        post.images.remove(url)
            else:
                for url in post.images[:]:
                    id = url.split('/')[-1]
                    fs_images.delete(id)
                    post.images.remove(url)
                
            if 'tx_attach_file' in self.request.POST:
                for url in self.request.POST.getall('tx_attach_file'):
                    if url not in post.files:
                        post.files.append(url)
                for url in post.files[:]:
                    if url not in self.request.POST.getall('tx_attach_file'):
                        # 파일 삭제
                        id = url.split('/')[-1]
                        fs_files.delete(id)
                        post.files.remove(url)
            else:
                for url in post.files[:]:
                    id = url.split('/')[-1]
                    fs_files.delete(id)
                    post.files.remove(url)
                
            post.save(safe=True)

            # 내가 글을 수정한 경우, 나를 제외한 블로그 그룹의 모든 사람에게 알람을 전송한다.
            msg = AlarmMessage(me=me, command=AlarmMessage.CMD_BLOG_EDIT, post=post)
            thread_alarmer.send(msg)
            
            return HTTPFound(location=self.request.route_path('blog_view', id=self.request.matchdict['id']))
        else:
            params = dict(post=post,
                          category=post.category,
                          save_url=self.request.route_path('blog_edit', id=str(post.id)),
                         )
            if post.category:
                params['group'] = post.category
                
            return params
        
    @view_config(route_name='blog_remove', 
                 permission='blog:delete')
    def blog_remove(self):
        blog_id = ObjectId(self.request.matchdict['id'])
        post = Post.objects.with_id(blog_id)
        # 첨부파일 삭제
        for url in post.images:
            fs_images.delete(url.split('/')[-1])
        for url in post.files:
            fs_files.delete(url.split('/')[-1])
        # 태그 삭제
        post.update_tags([])
        post.delete(safe=True)
        
        return Response(json.JSONEncoder().encode({}))
    
    @view_config(route_name='blog_post', 
                 renderer='blog/blog_post.mako', 
                 permission='blog:add')
    def blog_post(self):
        if self.request.method == 'POST':
            me = User.by_username(authenticated_userid(self.request))
            content = self.request.POST['tx_content'].replace("'", "&#39;").replace("\r\n", "")
            post = Post(title=self.request.POST['title'],
                        modified=datetime.now(),
                        content=content,
                        author=me)
            
            for attach in self.request.POST.getall('tx_attach_image'):
                post.images.append(attach)
            for attach in self.request.POST.getall('tx_attach_file'):
                post.files.append(attach)
            
            post.save(safe=True)
            
            # 내가 새글을 추가한 경우, 나를 제외한 블로그 그룹의 모든 사람에게 알람을 전송한다.
            msg = AlarmMessage(me=me, command=AlarmMessage.CMD_BLOG_ADD, post=post)
            thread_alarmer.send(msg)
            
            return HTTPFound(location=self.request.route_path('blog_view', id=str(post.id)))
        else:
            return dict(post=None,
                        save_url=self.request.route_path('blog_post'),
                        )

    @view_config(route_name='blog_attach_cancel', 
                 permission='blog:delete')
    def blog_attach_cancel(self):
        log.info(self.request.params)
        cancel_list = self.request.params['cancel_list']
        
        for url in cancel_list.split(","):
            w = url.split('/')
            if w[-2] == 'images':
                fs_images.delete(w[-1])
            elif w[-2] == 'files':
                fs_files.delete(w[-1])
        
        return Response(json.JSONEncoder().encode({'redirect': self.request.params['redirect']}))
    
    @view_config(route_name='image_post', 
                 renderer='blog/image_post.mako', 
                 permission='blog:add')
    def image_post(self):
        if self.request.method == 'POST':
            me = User.by_username(authenticated_userid(self.request))
            post = Post(title=self.request.params['title'],
                        modified=datetime.now(),
                        content='',
                        author=me)
            for attach in self.request.params['images'].split(","):
                post.images.append(attach)
            post.save(safe=True)

            # 내가 사진을 추가한 경우, 나를 제외한 블로그 그룹의 모든 사람에게 알람을 전송한다.
            msg = AlarmMessage(me=me, command=AlarmMessage.CMD_BLOG_ADD, post=post)
            thread_alarmer.send(msg)
                        
            return Response(json.JSONEncoder().encode({'redirect': self.request.route_path('blog_view', id=str(post.id))}))
        else:
            return dict(post=None,
                        category='',
                        save_url=self.request.route_path('image_post'),
                        )

    @view_config(route_name='blog_comment_add', 
                 permission='blog:add')
    def blog_comment_add(self):
        json_data = {}
        bid = self.request.matchdict['bid']
        me = User.by_username(authenticated_userid(self.request))
        try:
            blog_id = ObjectId(bid)
            post = Post.objects.with_id(blog_id)
        except:
            raise NotFound
    
        if self.request.method == 'POST':
            comment = Comment(content=self.request.params['comment'],
                              author=me)
            comment.save(safe=True)
            post.comments.append(comment)
            post.save(safe=True)

            # 내가 댓글을 추가한 경우, 나를 제외한 블로그 작성자나 댓글 작성자, 좋아요 사용자에게 알람을 전송한다.
            msg = AlarmMessage(me=me, command=AlarmMessage.CMD_BLOG_COMMENT, post=post)
            thread_alarmer.send(msg)
            
            json_data['bid'] = bid
            json_data['cid'] = str(comment.id)
            json_data['content'] = comment.content
    
            return Response(json.JSONEncoder().encode(json_data))
        else:
            raise NotFound
    
    @view_config(route_name='blog_comment_del', 
                 permission='blog:delete')
    def blog_comment_del(self):
        bid = self.request.matchdict['bid']
        cid = self.request.matchdict['cid']
        try:
            blog_id = ObjectId(bid)
            post = Post.objects.with_id(blog_id)
            comment_id = ObjectId(cid)
            comment = Comment.objects.with_id(comment_id)
        except:
            raise NotFound
    
        post.comments.remove(comment)
        post.save(safe=True)
        comment.delete(safe=True)
        
        return Response(json.JSONEncoder().encode({}))

    @view_config(route_name='blog_tag_edit',
                 permission='blog:edit')
    def blog_tag_edit(self):
        bid = self.request.matchdict['id']
        try:
            blog_id = ObjectId(bid)
            post = Post.objects.with_id(blog_id)
        except:
            raise NotFound
        
        if self.request.method == 'POST':
            if 'tags' in self.request.params:
                tags = [t.strip() for t in self.request.params['tags'].split(',') if t.strip() != '']
                post.update_tags(tags)
                
        return Response(json.JSONEncoder().encode({'tags': post.tags}))

    @view_config(route_name='blog_like_toggle',
                 permission='blog:edit')
    def blog_like_toggle(self):
        bid = self.request.matchdict['id']
        result = {}
        try:
            blog_id = ObjectId(bid)
            post = Post.objects.with_id(blog_id)
        except:
            raise NotFound
        
        if self.request.method == 'POST':
            me = User.by_username(authenticated_userid(self.request))
            if me in post.likes:
                post.likes.remove(me)
                result['like'] = False
            else:
                post.likes.append(me)
                result['like'] = True
        
            post.save()
            
            if result['like']:
                # 내가 좋아요를 선택한 경우, 블로그 작성자에게 알람을 전송한다.
                msg = AlarmMessage(me=me, command=AlarmMessage.CMD_BLOG_LIKE_IT, post=post)
                thread_alarmer.send(msg)

            return Response(json.JSONEncoder().encode(result))
        else:
            raise NotFound

    @view_config(route_name='search_tag',
                 renderer='blog/blog_list.mako', 
                 permission='blog:view')
    def search_tag(self):
        tag = self.request.matchdict['tag']
        return dict(posts=Post.objects(tags=tag).order_by('-modified'), category='')

    @view_config(route_name='group_list', 
                 renderer='blog/blog_list.mako', 
                 permission='blog:view')
    def group_list(self):
        gid = self.request.matchdict['id']
        group = Category.objects.with_id(ObjectId(gid))
        login = User.by_username(authenticated_userid(self.request))
        if not (group and (group.public or group.owner == login or login in group.members)):
            raise NotFound

        return dict(posts=Post.objects(category=group).order_by('-modified'), 
                    group=group)

    @view_config(route_name='group_post', 
                 renderer='blog/blog_post.mako', 
                 permission='blog:edit')
    def group_post(self):
        group = Category.objects.with_id(ObjectId(self.request.matchdict['id']))
        me = User.by_username(authenticated_userid(self.request))
        if not (group and (group.public or group.owner == me or me in group.members)):
            raise NotFound

        if self.request.method == 'POST':
            content = self.request.POST['tx_content'].replace("'", "&#39;").replace("\r\n", "")
            post = Post(title=self.request.POST['title'],
                        content=content,
                        category=group,
                        modified=datetime.now(),
                        author=User.by_username(authenticated_userid(self.request)))
            
            for attach in self.request.POST.getall('tx_attach_image'):
                post.images.append(attach)
            for attach in self.request.POST.getall('tx_attach_file'):
                post.files.append(attach)
            
            post.save(safe=True)

            # 내가 새글을 추가한 경우, 나를 제외한 블로그 그룹의 모든 사람에게 알람을 전송한다.
            msg = AlarmMessage(me=me, command=AlarmMessage.CMD_BLOG_ADD, post=post)
            thread_alarmer.send(msg)
            
            return HTTPFound(location=self.request.route_path('blog_view', id=str(post.id)))
        else:
            return dict(post=None,
                        group=group,
                        save_url=self.request.route_path('group_post', id=self.request.matchdict['id']),
                        )

    @view_config(route_name='group_add', 
                 permission='blog:add')
    def group_add(self):
        me = User.by_username(authenticated_userid(self.request))
        if self.request.method == 'POST':
            category = Category(name=self.request.params['name'],
                              owner=me)
            category.public = not self.request.params['private']
            category.save()

            if category.public:
                # 내가 공개 그룹을 추가한 경우, 나를 제외한 모든 사용자에게 알람을 전송한다.
                msg = AlarmMessage(me=me, command=AlarmMessage.CMD_GROUP_ADD, group=category)
                thread_alarmer.send(msg)
    
            return Response(json.JSONEncoder().encode({'id': str(category.id)}))
        else:
            raise NotFound
    
    @view_config(route_name='group_del', 
                 permission='blog:add')
    def group_del(self):
        Category.objects.with_id(ObjectId(self.request.matchdict['id'])).delete()
    
        return Response(json.JSONEncoder().encode({}))
    
    @view_config(route_name='group_edit', 
                 permission='blog:add')
    def group_edit(self):
        me = User.by_username(authenticated_userid(self.request))

        category = Category.objects.with_id(ObjectId(self.request.matchdict['id']))
        for name in self.request.params['members'].split(','):
            user = User.by_username(name)
            if user and user not in category.members:
                category.members.append(user)
        for user in category.members[:]:
            if user.username not in self.request.params['members'].split(','):
                category.members.remove(user)
        category.save()

        # 내가 비공개 그룹에 멤버를 추가한 경우, 나를 제외한 모든 멤버에게 알람을 전송한다.
        msg = AlarmMessage(me=me, command=AlarmMessage.CMD_GROUP_MEMBER_ADD, group=category)
        thread_alarmer.send(msg)

        return Response(json.JSONEncoder().encode({}))
    
    @view_config(route_name='alarm_view', 
                 permission='blog:view')
    def alarm_view(self):
        me = User.by_username(authenticated_userid(self.request))
        alarm = Alarm.objects.with_id(ObjectId(self.request.matchdict['id']))

        if self.request.method == 'GET':
            log.info(alarm)
            alarm.checked = True
            alarm.save()
            
            try:
                if alarm.type in [AlarmMessage.CMD_BLOG_ADD, AlarmMessage.CMD_BLOG_EDIT, AlarmMessage.CMD_BLOG_COMMENT]:
                    location = self.request.route_path('blog_view', id=alarm.doc.id)
                elif alarm.type in [AlarmMessage.CMD_GROUP_ADD, AlarmMessage.CMD_GROUP_MEMBER_ADD]:
                    location = self.request.route_path('group_list', id=alarm.doc.id)
                elif alarm.type == AlarmMessage.CMD_BLOG_LIKE_IT:
                    location = self.request.route_path('account_main', username=alarm.doc.username)
                else:
                    raise NotFound
            except:
                me.alarms.remove(alarm)
                me.save()
                raise NotFound
            
            return HTTPFound(location=location)
    
import Queue
import threading

class ThreadAlarmer(threading.Thread):
    """
    알람 전송을 위한 쓰레드
    """
    def __init__(self):
        threading.Thread.__init__(self)
        self.queue = Queue.Queue()
    
    def send(self, msg):
        self.queue.put(msg)
        
    def run(self):

        while True:
            # 큐에서 작업을 하나 가져온다
            msg = self.queue.get()
            log.info(msg.command)
            me = msg.me
            
            if msg.command in [AlarmMessage.CMD_BLOG_ADD, AlarmMessage.CMD_BLOG_EDIT]:
                # 내가 글 또는 사진을 추가하거나 수정된 경우, 
                # 나를 제외한 모든 그룹 사람에게 알람 전송  
                post = msg.post

                if not post.category or post.category.public:
                    # 블로그가 공개그룹인 경우
                    users = User.objects(id__ne=me.id)
                else:
                    # 블로그가 비공개 그룹인 경우
                    users = set([post.category.owner] + post.category.members) - set([me])

                text = u"<span class='alarm-user'>%s</span>님이 " % post.author.name 
                if post.category:
                    text += u"%s 그룹에 " % post.category.name
                else:
                    text += u"새소식에 "
                if msg.command == AlarmMessage.CMD_BLOG_ADD:
                    text += u"%s을 추가 했습니다." % (u'글' if post.content else u'사진')
                else:
                    text += u"%s을 업데이트 했습니다." % (u'글' if post.content else u'사진')

                for user in users:
                    if not user.is_active_user():
                        continue
                    alarm = Alarm(text=text, doc=post, type=msg.command)
                    alarm.save()
                    user.add_alarm(alarm)
            elif msg.command == AlarmMessage.CMD_BLOG_COMMENT:
                # 내가 블로그에 댓글을 추가한 경우, 
                # 나를 제외한 블로그 작성자나 다른 댓글 사용자, 좋아요 사용자에게 알람 전송 
                post = msg.post

                users = list(set([c.author for c in post.comments]) - set([me]))
                
                text = u"<span class='alarm-user'>%s</span>님" % me.name
                user_count = len(users)
                if user_count == 0:
                    text += u"이"
                if user_count == 1:
                    text += u"과 <span class='alarm-user'>%s</span>님이" % users[0].name
                else:
                    text += u", <span class='alarm-user'>%s</span>님 외 %d명도" % (users[0].name, user_count-1)
                text += u" <span class='alarm-user'>%s</span>님 글에 댓글을 남겼습니다." % post.author.name
                users = set(users) | set([post.author] + post.likes)
                users -= set(me)
                
                for user in users:
                    if not user.is_active_user():
                        continue
                    alarm = Alarm(text=text, doc=post, type=msg.command)
                    alarm.save()
                    user.add_alarm(alarm)
            elif msg.command == AlarmMessage.CMD_BLOG_LIKE_IT:
                # 내가 블로그에 좋아요를 선택한 경우,
                # 블로그 작성자에게 알람 전송
                post = msg.post
                user = post.author

                if user != me:
                    text = u"<span class='alarm-user'>%s</span>님이 " % me.name
                    text += u"<span class='alarm-user'>%s</span>님의 글을 좋아합니다." % user.name
                    alarm = Alarm(text=text, doc=me, type=msg.command)
                    alarm.save()
                    user.add_alarm(alarm)
            elif msg.command == AlarmMessage.CMD_GROUP_ADD:
                # 내가 공개 그룹을 추가한 경우
                text = u"<span class='alarm-user'>%s</span>님이 " % me.name
                text += u"<span class='alarm-group'>%s</span> 그룹을 추가했습니다."
                for user in User.objects:
                    if not user.is_active_user() or user == me:
                        continue
                    alarm = Alarm(text=text, doc=msg.group, type=msg.command)
                    alarm.save()
                    user.add_alarm(alarm)
            elif msg.command == AlarmMessage.CMD_GROUP_MEMBER_ADD:
                # 내가 비공개 그룹에 멤버를 추가한 경우,
                # 나를 제외한 모든 그룹 멤버들에게 알람 전송
                text = u"<span class='alarm-user'>%s</span>님이 " % me.name
                text += u"<span class='alarm-group'>%s</span> 그룹에 " % msg.group.name
                for user in msg.group.members:
                    if not user.is_active_user() or user == me:
                        continue
                    text2 = text + "<span class='alarm-user'>%s</span>님을 추가했습니다." % user.name
                    alarm = Alarm(text=text2, doc=msg.group, type=msg.command)
                    alarm.save()
                    user.add_alarm(alarm)
            
            # 작업 완료를 알리기 위해 큐에 시그널을 보낸다.
            self.queue.task_done()
    
    def end(self):
        self.queue.join()
