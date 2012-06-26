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
    
    @view_config(route_name='blog_list', 
                 renderer='blog/blog_list.mako', 
                 permission='blog:view')
    def blog_list(self):
        return dict(posts=Post.objects(category=None).order_by('-published'), 
                    group=None)

    @view_config(route_name='blog_view', 
                 renderer='blog/blog_view.mako', 
                 permission='blog:view')
    def blog_view(self):
        try:
            blog_id = ObjectId(self.request.matchdict['id'])
            post = Post.objects.with_id(blog_id)
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
        except:
            raise NotFound
    
        if self.request.method == 'POST':
            log.warn(self.request.POST)
            post.title = self.request.POST['title']
            post.content = self.request.POST['tx_content'].replace("'", "&#39;").replace("\r\n", "")
            post.published = datetime.now()
            post.author = User.by_username(authenticated_userid(self.request))

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
            log.warn(self.request.POST)
            content = self.request.POST['tx_content'].replace("'", "&#39;").replace("\r\n", "")
            post = Post(title=self.request.POST['title'],
                        content=content,
                        published=datetime.now(),
                        author=User.by_username(authenticated_userid(self.request)))
            
            for attach in self.request.POST.getall('tx_attach_image'):
                post.images.append(attach)
            for attach in self.request.POST.getall('tx_attach_file'):
                post.files.append(attach)
            
            post.save(safe=True)
            
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
            log.warn(self.request.POST)
            post = Post(title=self.request.params['title'],
                        published=datetime.now(),
                        content='',
                        author=User.by_username(authenticated_userid(self.request)))
            for attach in self.request.params['images'].split(","):
                post.images.append(attach)
            post.save(safe=True)
            
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
        try:
            blog_id = ObjectId(bid)
            post = Post.objects.with_id(blog_id)
        except:
            raise NotFound
    
        if self.request.method == 'POST':
            comment = Comment(content=self.request.params['comment'],
                              author=User.by_username(authenticated_userid(self.request)),
                              posted=datetime.now())
            comment.save(safe=True)
            post.comments.append(comment)
            post.save(safe=True)
            
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
                tags = [t.strip() for t in self.request.params['tags'].split(',')]
                '' in tags and tags.remove('')
                post.update_tags(tags)
                
        return Response(json.JSONEncoder().encode({'tags': post.tags}))

    @view_config(route_name='search_tag',
                 renderer='blog/blog_list.mako', 
                 permission='blog:view')
    def search_tag(self):
        tag = self.request.matchdict['tag']
        return dict(posts=Post.objects(tags=tag).order_by('-published'), category='')

    @view_config(route_name='group_list', 
                 renderer='blog/blog_list.mako', 
                 permission='blog:view')
    def group_list(self):
        gid = self.request.matchdict['id']
        group = Category.objects.with_id(ObjectId(gid))
        login = User.by_username(authenticated_userid(self.request))
        if not (group and (group.public or group.owner == login or login in group.members)):
            raise NotFound

        return dict(posts=Post.objects(category=group).order_by('-published'), 
                    group=group)

    @view_config(route_name='group_post', 
                 renderer='blog/blog_post.mako', 
                 permission='blog:edit')
    def group_post(self):
        group = Category.objects.with_id(ObjectId(self.request.matchdict['id']))
        login = User.by_username(authenticated_userid(self.request))
        if not (group and (group.public or group.owner == login or login in group.members)):
            raise NotFound

        if self.request.method == 'POST':
            log.warn(self.request.POST)
            content = self.request.POST['tx_content'].replace("'", "&#39;").replace("\r\n", "")
            post = Post(title=self.request.POST['title'],
                        content=content,
                        category=group,
                        published=datetime.now(),
                        author=User.by_username(authenticated_userid(self.request)))
            
            for attach in self.request.POST.getall('tx_attach_image'):
                post.images.append(attach)
            for attach in self.request.POST.getall('tx_attach_file'):
                post.files.append(attach)
            
            post.save(safe=True)
            
            return HTTPFound(location=self.request.route_path('blog_view', id=str(post.id)))
        else:
            return dict(post=None,
                        group=group,
                        save_url=self.request.route_path('group_post', id=self.request.matchdict['id']),
                        )

    @view_config(route_name='group_add', 
                 permission='blog:add')
    def group_add(self):
        log.info(self.request.params)
        if self.request.method == 'POST':
            category = Category(name=self.request.params['name'],
                              owner=User.by_username(authenticated_userid(self.request)))
            category.public = not self.request.params['private']
            category.save()
    
            return Response(json.JSONEncoder().encode({'id': str(category.id)}))
        else:
            raise NotFound
    
    @view_config(route_name='group_del', 
                 permission='blog:add')
    def group_del(self):
        log.info(self.request.params)
        Category.objects.with_id(ObjectId(self.request.matchdict['id'])).delete()
    
        return Response(json.JSONEncoder().encode({}))
    
    @view_config(route_name='group_edit', 
                 permission='blog:add')
    def group_edit(self):
        log.info(self.request.params)
    
        category = Category.objects.with_id(ObjectId(self.request.matchdict['id']))
        for name in self.request.params['members'].split(','):
            user = User.by_username(name)
            if user and user not in category.members:
                category.members.append(user)
        for user in category.members[:]:
            if user.username not in self.request.params['members'].split(','):
                category.members.remove(user)
        category.save()
            
        return Response(json.JSONEncoder().encode({}))
    
