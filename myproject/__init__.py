# -*- coding: utf-8 -*- 

from urlparse import urlparse
from mongoengine import connect
from gridfs import GridFS

from pyramid.config import Configurator
from pyramid.session import UnencryptedCookieSessionFactoryConfig
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from .models import groupfinder
from .search import ThreadIndex
from .admin import ThreadMail
from .authorization import InAuthorizationPolicy

import __builtin__

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    
    # session factory
    authn_policy = AuthTktAuthenticationPolicy('sosecret', callback=groupfinder)
    authz_policy = InAuthorizationPolicy()
    config = Configurator(settings=settings, 
                          root_factory='myproject.models.RootFactory',
                          session_factory=UnencryptedCookieSessionFactoryConfig('itsaseekreet'))
    config.set_authentication_policy(authn_policy)
    config.set_authorization_policy(authz_policy)

    config.include('pyramid_mailer')
    
    db_url = urlparse(settings['mongo.url'])
    conn = connect(db_url.path[1:], 
                   host=db_url.hostname, 
                   port=db_url.port, 
                   username=db_url.username,
                   password=db_url.password)

    __builtin__.db = conn[db_url.path[1:]]
    __builtin__.fs_files = GridFS(db, 'fs')
    __builtin__.fs_images = GridFS(db, 'images')

    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')
    config.add_route('employees', '/employees')
    config.add_route('team', '/team')
    config.add_route('team_view', '/team/{tid}')
    config.add_route('account_main', '/account/{username}')
    config.add_route('account_info', '/account/{username}/info/{category}')
    config.add_route('account_info_get', '/account/{username}/info/{category}/get')
    config.add_route('account_info_save', '/account/{username}/info/{category}/save')
    config.add_route('account_photo', '/account/{username}/photo')
    config.add_route('blog_list', '/blog/list')
    config.add_route('blog_post', '/blog/post')
    config.add_route('blog_view', '/blog/{id}/view')
    config.add_route('blog_edit', '/blog/{id}/edit')
    config.add_route('blog_remove', '/blog/{id}/remove')
    config.add_route('blog_comment_add', '/blog/{bid}/comment/add')
    config.add_route('blog_comment_del', '/blog/{bid}/comment/del/{cid}')
    config.add_route('blog_tag_edit', '/blog/{id}/tag_edit')
    config.add_route('blog_attach_cancel', '/blog/attach_cancel')
    config.add_route('group_list', '/blog/group/list/{id}')
    config.add_route('group_post', '/blog/group/post/{id}')
    config.add_route('group_add', '/blog/group/add')
    config.add_route('group_del', '/blog/group/del/{id}')
    config.add_route('group_edit', '/blog/group/edit/{id}')
    config.add_route('image_post', '/image/post')
    config.add_route('search_all', '/search/all')
    config.add_route('search_prefix', '/search/prefix')
    config.add_route('search_tag', '/search/tag/{tag}')
    config.add_route('search_user', '/search/user/{name}')
    config.add_route('image_upload', '/upload/images')
    config.add_route('image_fullsize', '/images/{id}')
    config.add_route('image_thumbnail', '/images/{id}/thumbnail')
    config.add_route('image_delete', '/blog/{bid}/images/{id}/delete')
    config.add_route('file_upload', '/upload/files')
    config.add_route('file_storage', '/files/{id}')
    config.add_route('login', '/login')
    config.add_route('logout', '/logout')
    config.add_route('admin_account', '/admin/account')
    config.add_route('admin_account_activate_request', '/admin/account/activate_request')
    config.add_route('admin_account_activate', '/admin/account/activate/{username}')
    config.add_route('admin_account_deactivate', '/admin/account/account/deactivate')
    config.add_route('admin_account_edit', '/admin/account/edit/{username}')
    config.add_route('admin_account_duplicate', '/admin/account/duplicate/{username}')
    config.add_route('admin_team', '/admin/team')
    config.add_route('admin_team_edit', '/admin/team/{id}/edit')
    config.add_route('admin_team_save', '/admin/team/{id}/save')
    config.add_route('admin_team_del', '/admin/team/del')
    config.add_route('admin_team_member_add', '/admin/team/{id}/member_add')
    config.add_route('admin_team_member_del', '/admin/team/{id}/member_del')
    config.add_route('admin_permission', '/admin/permission')
    config.add_route('admin_permission_edit', '/admin/permission/{id}/edit')
    config.add_route('admin_permission_save', '/admin/permission/{id}/save')
    config.add_route('admin_permission_del', '/admin/permission/del')
    config.add_route('admin_permission_member_add', '/admin/permission/{id}/member_add')
    config.add_route('admin_permission_member_del', '/admin/permission/{id}/member_del')
    config.add_route('admin_group', '/admin/group')
    config.add_route('admin_group_edit', '/admin/group/{id}/edit')
    config.add_route('admin_group_save', '/admin/group/{id}/save')
    config.add_route('admin_group_del', '/admin/group/del')
    config.add_route('admin_group_member_add', '/admin/group/{id}/member_add')
    config.add_route('admin_group_member_del', '/admin/group/{id}/member_del')
    config.add_route('admin_blog', '/admin/blog')
    config.add_route('admin_mail_test', '/admin/mail/test')
    config.scan()

    tIndex = ThreadIndex()
    tIndex.setDaemon(True)
    tIndex.start()
    
    tMail = ThreadMail()
    tMail.setDaemon(True)
    tMail.start()
    __builtin__.index = tIndex
    __builtin__.mail_thread = tMail

    ret = config.make_wsgi_app()
    
    tIndex.end()
    tMail.end()
    
    return ret
