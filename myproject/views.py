# -*- coding: utf-8 -*- 

import logging

from pyramid.httpexceptions import HTTPFound
from pyramid.view import (
    view_config,
    forbidden_view_config,
    )
from pyramid.security import (
    remember,
    forget,
    authenticated_userid
    )
from .models import *

logging.basicConfig()
log = logging.getLogger(__file__)

@view_config(route_name='home', renderer='home.mako')
def home(request):
    return dict(posts=Post.objects.order_by('-published')[:5])

@view_config(context='pyramid.exceptions.NotFound', renderer='notfound.mako')
def notfound_view(self):
    return {}

@view_config(route_name='login', renderer='login.mako')
@forbidden_view_config(renderer='login.mako')
def login(request):
    login_url = request.route_url('login')
    referrer = request.url
    if referrer == login_url:
        referrer = '/' # never user the login from itself as came_from
    came_from = request.params.get('came_from', referrer)
    message = ''
    login = ''
    password = ''
    if 'commit' in request.POST:
        login = request.params['login']
        password = request.params['password']
        user = User.by_username(login)
        log.warn(user)
        if user and user.validate_password(password):
            headers = remember(request, login)
            return HTTPFound(location=came_from, headers=headers)
        request.session.flash('Failed login')
        
    return dict(message = message,
                url = request.application_url + '/login',
                came_from = came_from,
                login = login,
                password = password,
                )

@view_config(route_name='logout')
def logout(request):
    headers = forget(request)
    return HTTPFound(location=request.route_url('home'),
                     headers=headers)
