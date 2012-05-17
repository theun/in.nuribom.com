# -*- coding: utf-8 -*- 

import bson
import logging
import mimetypes

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

class BlogView(object):
    
    def __init__(self, request):
        self.request = request
    
    @view_config(route_name='blog_list', 
                 renderer='blog/blog_list.mako', 
                 permission='blog:view')
    def blog_list(self):
        page = 0
        category = self.request.matchdict['category'];
        return dict(posts=Post.objects(category=category).order_by('-published')[page*PAGE_ITEMS:(page+1)*PAGE_ITEMS], 
                    category=category,
                    )
        
    @view_config(route_name='blog_view', 
                 renderer='blog/blog_view.mako', 
                 permission='blog:view')
    def blog_view(self):
        try:
            blog_id = bson.ObjectId(self.request.matchdict['id'])
            post = Post.objects.with_id(blog_id)
        except:
            raise NotFound
        
        return dict(post=post)
                
    @view_config(route_name='blog_edit', 
                 renderer='blog/blog_post.mako', 
                 permission='blog:edit')
    def blog_edit(self):
        try:
            blog_id = bson.ObjectId(self.request.matchdict['id'])
            post = Post.objects.with_id(blog_id)
        except:
            raise NotFound
    
        if 'commit' in self.request.POST:
            post.title = self.request.POST['title']
            post.content = self.request.POST['content']
            post.published = datetime.now()
            post.author = User.by_username(authenticated_userid(self.request))

            if 'files[]' in self.request.POST and self.request.POST['files[]'] != '':
                post = Post.objects.with_id(post.id)
                for attach in self.request.POST.getall('files[]'):
                    fs = GridFSProxy()
                    content_type = mimetypes.guess_type(attach.filename)[0]
                    if content_type is None:
                        content_type = 'application/octet-stream'
                    fs.put(attach.file, filename=attach.filename, content_type=content_type)
                    post.attachments.append(fs)
            
            post.save(safe=True)
            
            return HTTPFound(location=self.request.route_path('blog_view', id=self.request.matchdict['id']))
        elif 'remove' in self.request.POST:
            return HTTPFound(location=self.request.route_path('blog_remove', 
                                                        id=self.request.matchdict['id']))
        elif 'cancel' in self.request.POST:
            return HTTPFound(location=self.request.route_path('blog_view', id=self.request.matchdict['id']))
            
        return dict(post=post,
                    category=post.category,
                    save_url=self.request.route_path('blog_edit', id=str(post.id)),
                    )
        
    @view_config(route_name='blog_remove', 
                 permission='blog:delete')
    def blog_remove(self):
        try:
            blog_id = bson.ObjectId(self.request.matchdict['id'])
            post = Post.objects.with_id(blog_id)
            for attachment in post.attachments:
                attachment.delete()
            category = post.category
            post.delete(safe=True)
        except:
            raise NotFound
        
        return HTTPFound(location=self.request.route_path('blog_list', category=category))
    
    @view_config(route_name='blog_post', 
                 renderer='blog/blog_post.mako', 
                 permission='blog:add')
    def blog_post(self):
        if self.request.method == 'POST':
            category = self.request.params['category']
            post = Post(title=self.request.POST['title'],
                        content=self.request.POST['content'],
                        published=datetime.now(),
                        category=category,
                        author=User.by_username(authenticated_userid(self.request)))
            
            if 'files[]' in self.request.POST and self.request.POST['files[]'] != '':
                for attach in self.request.POST.getall('files[]'):
                    fs = GridFSProxy()
                    content_type = mimetypes.guess_type(attach.filename)[0]
                    if content_type is None:
                        content_type = 'application/octet-stream'
                    fs.put(attach.file, filename=attach.filename, content_type=content_type)
                    post.attachments.append(fs)

            post.save(safe=True)
            
            return HTTPFound(location=self.request.route_path('blog_view', id=str(post.id)))
        
        return dict(post=None,
                    category=self.request.matchdict['category'],
                    save_url=self.request.route_path('blog_post', category=self.request.matchdict['category']),
                    )

    @view_config(route_name='blog_attachment',
                 request_method='GET')
    def blog_attachment_get(self):
        try:
            log.warn(self.request.matchdict['id'])
            blog_id = bson.ObjectId(self.request.matchdict['id'])
            post = Post.objects.with_id(blog_id)
            filename = self.request.matchdict['filename']
            for i in range(len(post.attachments)):
                if post.attachments[i].name == filename:
                    log.warn("content_type: %s, attachment: %s" % (post.attachments[i].content_type, post.attachments[i].name))
                    if post.attachments[i].content_type is None:
                        content_type = 'application/octet-stream'
                    else:
                        content_type = post.attachments[i].content_type.encode('ascii')
                    response = Response(content_type=content_type)
                    response.body_file = post.attachments[i]
                    break
            if response is None:
                raise NotFound
        except:
            raise NotFound
            
        return response 

    @view_config(route_name='blog_attachment_del',
                 permission='blog:add')
    def blog_attachment_del(self):
        bid = self.request.matchdict['id']
        try:
            blog_id = bson.ObjectId(bid)
            filename = self.request.matchdict['filename']
            post = Post.objects.with_id(blog_id)
            for i in range(len(post.attachments)):
                if post.attachments[i].name == filename:
                    del post.attachments[i]
                    break
            post.save(safe=True)
        except:
            raise NotFound
            
        return HTTPFound(location=self.request.route_path('blog_edit', id=bid)) 

    @view_config(route_name='blog_comment_add', 
                 permission='blog:add')
    def blog_comment_add(self):
        bid = self.request.matchdict['bid']
        try:
            blog_id = bson.ObjectId(bid)
            post = Post.objects.with_id(blog_id)
        except:
            raise NotFound
    
        if 'comment' in self.request.POST:
            comment = Comment(content=self.request.POST['comment'],
                              author=User.by_username(authenticated_userid(self.request)),
                              posted=datetime.now())
            post.comment.append(comment)
            post.save(safe=True)
    
        return HTTPFound(location=self.request.route_path('blog_view', id=bid))
    
    @view_config(route_name='blog_comment_del', 
                 permission='blog:delete')
    def blog_comment_del(self):
        bid = self.request.matchdict['bid']
        try:
            blog_id = bson.ObjectId(bid)
            post = Post.objects.with_id(blog_id)
        except:
            raise NotFound
    
        if 'cid' in self.request.matchdict:
            del post.comment[int(self.request.matchdict['cid'])]
            post.save(safe=True)
        
        return HTTPFound(location=self.request.route_path('blog_view', id=bid))
