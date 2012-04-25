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
from .models import User

logging.basicConfig()
log = logging.getLogger(__file__)

@view_config(route_name='home', renderer='home.mako')
def home(request):
    return {}

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
    activate = ''
    if 'commit' in request.POST:
        login = request.params['login']
        password = request.params['password']
        user = User.by_username(login)
        if user and user.activate == 'REQUESTED' and password == request.params['confirm_password']:
            user.set_password(password)
            user.permissions.append('blog:*')
            user.permissions.append('account:*')
            user.save(safe=True)
            headers = remember(request, login)
            return HTTPFound(location=came_from, headers=headers)
        elif user and user.validate_password(password):
            headers = remember(request, login)
            return HTTPFound(location=came_from, headers=headers)
        request.session.flash('Failed login')
    elif 'login' in request.params:
        login = request.params['login']
        user = User.by_username(login)
        if user and user.activate == 'REQUESTED':
            activate = user.activate
            
    return dict(url= request.application_url + '/login',
                came_from=came_from,
                login=login,
                password=password,
                activate=activate,
                )

@view_config(route_name='logout')
def logout(request):
    headers = forget(request)
    return HTTPFound(location=request.route_url('home'),
                     headers=headers)
