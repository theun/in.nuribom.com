# -*- coding: utf-8 -*- 

import logging
import bson
import json
import mimetypes

from pyramid.httpexceptions import HTTPFound
from pyramid.exceptions import NotFound
from pyramid.response import Response
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
    return HTTPFound(location=request.route_path('account_main', username=authenticated_userid(request)))

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

@view_config(route_name='image_upload')
def image_upload(request):
    name = request.POST['name']
    content_type = mimetypes.guess_type(name)[0]
    if content_type:
        image = ImageStorage.objects.get_or_create(name=name)
        if image[1]: # create?
            image[0].file.put(request.POST['file'].file,
                              filename=request.POST['file'].filename,
                              content_type=content_type)
        else:
            image[0].file.replace(request.POST['file'].file,
                                  filename=request.POST['file'].filename,
                                  content_type=content_type)
        image[0].save(safe=True) 
        
    json_data = {}
    json_data['jsonrpc'] = "2.0"
    json_data['result'] = None
    json_data['id'] = "id"

    return Response(json.JSONEncoder().encode(json_data))

@view_config(route_name='image_storage')
def image_storage(request):
    filename = request.matchdict['filename']
    image = ImageStorage.objects(name=filename).first()
    
    if image is None:
        response = Response(content_type='image/png')
        response.app_iter = open('myproject/static/images/no_image.png', 'rb')
    else:
        content_type = image.file.content_type.encode('ascii')
        response = Response(content_type=content_type)
        response.body_file = image.file
        
    return response 
    
@view_config(route_name='file_upload')
def file_upload(request):
    name = request.POST['name']
    content_type = mimetypes.guess_type(name)[0]
    if content_type:
        fobj = FileStorage.objects.get_or_create(name=name)
        if fobj[1]: # create?
            fobj[0].file.put(request.POST['file'].file,
                             filename=request.POST['file'].filename,
                             content_type=content_type)
        else:
            fobj[0].file.replace(request.POST['file'].file,
                                 filename=request.POST['file'].filename,
                                 content_type=content_type)
        fobj[0].save(safe=True) 
        
    json_data = {}
    json_data['jsonrpc'] = "2.0"
    json_data['result'] = None
    json_data['id'] = "id"

    return Response(json.JSONEncoder().encode(json_data))

@view_config(route_name='file_storage')
def file_storage(request):
    filename = request.matchdict['filename']
    fobj = FileStorage.objects(name=filename).first()
    
    if fobj is None:
        response = Response(content_type='image/png')
        response.app_iter = open('myproject/static/images/not_found.png', 'rb')
    else:
        content_type = fobj.file.content_type.encode('ascii')
        response = Response(content_type=content_type)
        response.body_file = fobj.file
    response.headers["Content-disposition"] = "filename=" + fobj.file.name.encode('euc-kr')
        
    return response 
    
@view_config(context='pyramid.exceptions.NotFound', renderer='notfound.mako')
def notfound_view(self):
    return {}

@view_config(route_name='login', renderer='login.mako')
@forbidden_view_config(renderer='login.mako')
def login(request):
    if authenticated_userid(request):
        headers = remember(request, authenticated_userid(request))
        return HTTPFound(location=request.route_path('home'), headers=headers)
        
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
            user.groups.append('group:employee')
            user.save(safe=True)
            headers = remember(request, login)
            return HTTPFound(location=request.route_path('account_main', username=login), headers=headers)
        elif user and user.validate_password(password):
            headers = remember(request, login)
            return HTTPFound(location=request.route_path('account_main', username=login), headers=headers)
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
