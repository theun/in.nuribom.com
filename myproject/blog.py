# -*- coding: utf-8 -*- 

import datetime
import bson
import logging

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

from .models import *

logging.basicConfig()
log = logging.getLogger(__file__)

class BlogView(object):
    
    def __init__(self, request):
        self.request = request
    
    @view_config(route_name='blog_list', 
                 renderer='blog/blog_list.mako', 
                 permission='blog:view')
    def blog_list(self):
        page = 0
        if 'page' in self.request.matchdict:
            page = int(self.request.matchdict['page'])
        pages = (Post.objects.count()+4)/5
        
        return dict(posts=Post.objects.order_by('-published')[page*5:(page+1)*5], 
                    pages=pages,
                    page=page,
                    login=User.by_username(authenticated_userid(self.request))
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
            post.published = datetime.datetime.now()
            post.author = User.by_username(authenticated_userid(self.request))
            post.save()
            
            return HTTPFound(location=self.request.route_url('blog_view', id=self.request.matchdict['id']))
        elif 'remove' in self.request.POST:
            return HTTPFound(location=self.request.route_url('blog_remove', 
                                                        id=self.request.matchdict['id']))
        elif 'cancel' in self.request.POST:
            return HTTPFound(location=self.request.route_url('blog_view', id=self.request.matchdict['id']))
            
        return dict(post=post,
                    save_url=self.request.route_url('blog_edit', id=str(post.id)),
                    )
        
    @view_config(route_name='blog_remove', 
                 permission='blog:delete')
    def blog_remove(self):
        try:
            blog_id = bson.ObjectId(self.request.matchdict['id'])
            Post.objects(id=blog_id).delete(safe=True)
        except:
            raise NotFound
        
        return HTTPFound(location=self.request.route_url('home'))
    
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
                              name=User.by_username(authenticated_userid(self.request)).name,
                              posted=datetime.datetime.now())
            post.comment.append(comment)
            post.save(safe=True)
    
        return HTTPFound(location=self.request.route_url('blog_view', id=bid))
    
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
        
        return HTTPFound(location=self.request.route_url('blog_view', id=bid))

    @view_config(route_name='blog_post', 
                 renderer='blog/blog_post.mako', 
                 permission='blog:add')
    def blog_post(self):
        if 'commit' in self.request.POST:
            post = Post(title=self.request.POST['title'],
                        content=self.request.POST['content'],
                        published=datetime.datetime.now(),
                        author=User.by_username(authenticated_userid(self.request)))
            post.save()
            
            return HTTPFound(location=self.request.route_url('home'))
        
        return dict(post=None,
                    save_url=self.request.route_url('blog_post'),
                    )
