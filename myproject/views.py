# -*- coding: utf-8 -*- 

import logging
import bson

from pyramid.httpexceptions import HTTPFound
from pyramid.exceptions import NotFound
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
from functools import cmp_to_key 

logging.basicConfig()
log = logging.getLogger(__file__)

@view_config(route_name='home', renderer='home.mako')
def home(request):
    return {}

@view_config(route_name='team', renderer='team.mako', permission='account:view')
def team(request):
    return dict(teams=Team.objects.order_by('name'))

@view_config(route_name='team_view', renderer='team_view.mako', permission='account:view')
def team_view(request):
    try:
        team_id = bson.ObjectId(request.matchdict['tid'])
        team = Team.objects.with_id(team_id)
    except:
        raise NotFound

    users = User.objects(Q(team=team.name) & Q(leave_date=''))
    
    order_by = request.params['sort'] if 'sort' in request.params else 'name'
    reverse = True if 'reverse' in request.params else False 
    
    if order_by == 'rank':
        users = sorted(users, key=cmp_to_key(compare_rank), reverse=reverse)
    else:
        if reverse:
            order_by = '-' + order_by
        users = users.order_by(order_by)

    return dict(members=users,
                team=team
                )

@view_config(context='pyramid.exceptions.NotFound', renderer='notfound.mako')
def notfound_view(self):
    return {}

@view_config(route_name='login', renderer='login.mako')
@forbidden_view_config(renderer='login.mako')
def login(request):
    login_url = request.route_path('login')
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
        if user and user.activate == 'REQUESTED':
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
    return HTTPFound(location=request.route_path('home'),
                     headers=headers)
