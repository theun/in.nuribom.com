# -*- coding: utf-8 -*- 

from urlparse import urlparse
from mongoengine import connect

from pyramid.config import Configurator
from pyramid.session import UnencryptedCookieSessionFactoryConfig
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from .models import groupfinder
from .authorization import InAuthorizationPolicy

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    settings['mako.directories'] = '/home/theun/workspace/pyramid_test/MyProject/myproject/templates' 

    # session factory
    authn_policy = AuthTktAuthenticationPolicy('sosecret', callback=groupfinder)
    authz_policy = InAuthorizationPolicy()
    config = Configurator(settings=settings, 
                          root_factory='myproject.models.RootFactory',
                          session_factory=UnencryptedCookieSessionFactoryConfig('itsaseekreet'))
    config.set_authentication_policy(authn_policy)
    config.set_authorization_policy(authz_policy)

    db_url = urlparse(settings['mongo.url'])
    connect(db_url.path[1:], 
            host=db_url.hostname, 
            port=db_url.port, 
            username=db_url.username,
            password=db_url.password)

    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')
    config.add_route('account_main', '/account/{username}')
    config.add_route('account_info', '/account/{username}/info/{category}')
    config.add_route('account_info_get', '/account/{username}/info/{category}/get')
    config.add_route('account_info_save', '/account/{username}/info/{category}/save')
    config.add_route('account_photo', '/account/{username}/photo')
    config.add_route('blog_list', '/blog/list/{page}')
    config.add_route('blog_post', '/blog/post')
    config.add_route('blog_view', '/blog/view/{id}')
    config.add_route('blog_edit', '/blog/edit/{id}')
    config.add_route('blog_remove', '/blog/remove/{id}')
    config.add_route('blog_comment_add', '/blog/{bid}/comment/add')
    config.add_route('blog_comment_del', '/blog/{bid}/comment/del/{cid}')
    config.add_route('login', '/login')
    config.add_route('logout', '/logout')
    config.scan()
    return config.make_wsgi_app()
