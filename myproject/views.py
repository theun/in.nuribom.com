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
from myproject.models import *
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
    log.info(request.params)
    id   = request.POST['id']
    name = request.POST['name']
    content_type = mimetypes.guess_type(name)[0]
    if content_type:
        if 'chunk' in request.POST:
            if fs_images.exists(id):
                data  = bson.Binary(request.POST['file'].file.read())
                chunk = dict(files_id=id,
                             n=int(request.POST['chunk']),
                             data=data)
                db.images.chunks.insert(chunk)
                db.images.files.update(dict(_id=id), {'$inc': dict(length=len(data))})
            else:
                fs_images.put(request.POST['file'].file,
                             _id=id,
                             filename=name,
                             content_type=content_type,
                             chunk_size=512*1024)
        else:
            fs_images.put(request.POST['file'].file,
                         _id=id,
                         filename=name,
                         content_type=content_type,
                         chunk_size=512*1024)
        
    json_data = {}
    json_data['jsonrpc'] = "2.0"
    json_data['result'] = None
    json_data['id'] = "id"

    return Response(json.JSONEncoder().encode(json_data))

@view_config(route_name='image_storage')
def image_storage(request):
    id = request.matchdict['id']
    try:
        image = fs_images.get(id)
        content_type = image.content_type.encode('ascii')
        response = Response(content_type=content_type)
        response.body_file = image
    except:
        response = Response(content_type='image/png')
        response.app_iter = open('myproject/static/images/no_image.png', 'rb')
        
    return response 
    
@view_config(route_name='file_upload')
def file_upload(request):
    log.info(request.params)
    json_data = {}
    if request.method != "POST":
        json_data['jsonrpc'] = "2.0"
        json_data['error'] = {"code": 100, "message": "잘못된 요청입니다."}
        json_data['id'] = "id"
    
        return Response(json.JSONEncoder().encode(json_data))
        
    id   = request.POST['id']
    name = request.POST['name']
    content_type = mimetypes.guess_type(name)[0]
    if content_type:
        if 'chunk' in request.POST:
            if fs_files.exists(id):
                data  = bson.Binary(request.POST['file'].file.read())
                chunk = dict(files_id=id,
                             n=int(request.POST['chunk']),
                             data=data)
                db.fs.chunks.insert(chunk)
                db.fs.files.update(dict(_id=id), {'$inc': dict(length=len(data))})
            else:
                fs_files.put(request.POST['file'].file,
                             _id=id,
                             filename=name,
                             content_type=content_type,
                             chunk_size=4*1024*1024)
        else:
            fs_files.put(request.POST['file'].file,
                         _id=id,
                         filename=name,
                         content_type=content_type,
                         chunk_size=4*1024*1024)
        
    json_data = {}
    json_data['jsonrpc'] = "2.0"
    json_data['result'] = None
    json_data['id'] = "id"

    return Response(json.JSONEncoder().encode(json_data))

@view_config(route_name='file_storage')
def file_storage(request):
    id = request.matchdict['id']
    try:
        f = fs_files.get(id)
        content_type = f.content_type.encode('ascii')
        response = Response(content_type=content_type)
        response.body_file = f
        response.headers["Content-disposition"] = "filename=" + f.name.encode('euc-kr')
    except:
        response = Response(content_type='image/png')
        response.app_iter = open('myproject/static/images/not_found.png', 'rb')
        
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
