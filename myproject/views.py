# -*- coding: utf-8 -*- 

import logging
import json
import mimetypes

from bson import ObjectId, Binary
from json import JSONEncoder
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
from .search import FTS_engine 

from PIL import Image
from cStringIO import StringIO
from datetime import datetime

logging.basicConfig()
log = logging.getLogger(__file__)

THUMBNAIL_WIDTH = 230

@view_config(route_name="home", renderer="index.mako", request_method="GET")
def home(request):
    log.debug("ROUTE:HOME")
    return {}

@view_config(route_name="user_list", permission="account:view")
def user_list(request):
    users = [u.name for u in User.objects.order_by('name') if u.is_active_user()]
    
    return Response(JSONEncoder().encode({'users': users}))
    
@view_config(route_name='team', renderer='team.mako', permission='account:view')
def team(request):
    return dict(teams=Team.objects.order_by('name'))

@view_config(route_name='team_view', renderer='team_view.mako', permission='account:view')
def team_view(request):
    try:
        team_id = ObjectId(request.matchdict['tid'])
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
                data  = Binary(request.POST['file'].file.read())
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

    return Response(JSONEncoder().encode(json_data))

@view_config(route_name='image_fullsize')
def image_fullsize(request):
    id = request.matchdict['id']
    try:
        image = fs_images.get(id)
        content_type = image.content_type.encode('ascii')
        response = Response(content_type=content_type)
        response.body_file = image
        response.headers["Content-disposition"] = "filename=" + image.name.encode('euc-kr')
    except:
        response = Response(content_type='image/png')
        response.app_iter = open('myproject/static/img/no_image.png', 'rb')
        
    return response 

@view_config(route_name='image_thumbnail')
def image_thumbnail(request):
    id = request.matchdict['id']
    image = fs_images.get(id)
    #generate thumbnail in memory
    img = Image.open(image)
    if img.size[0] > THUMBNAIL_WIDTH:
        w, h = THUMBNAIL_WIDTH, (THUMBNAIL_WIDTH * img.size[1]) / img.size[0]
    else:
        w, h = img.size
    
    thumbnail = img.copy()
    thumbnail.thumbnail((w, h), Image.ANTIALIAS)
    io = StringIO()
    thumbnail.save(io, img.format)
    io.seek(0)
    content_type = image.content_type.encode('ascii')
    response = Response(content_type=content_type)
    response.body_file = io
    response.headers["Content-disposition"] = "filename=" + image.name.encode('euc-kr')
        
    return response 

def image_thumbnail_info(id):
    info = {}
    
    image = fs_images.get(id)
    size  = Image.open(image).size
    info['name'] = image.name
    info['width'] = THUMBNAIL_WIDTH
    info['height'] = (THUMBNAIL_WIDTH * size[1]) / size[0]
    
    return info

@view_config(route_name='image_delete')
def image_delete(request):
    log.info(request)
    try:
        blog_id = ObjectId(request.matchdict['bid'])
        post = Post.objects.with_id(blog_id)
    except:
        raise NotFound
    
    id = request.matchdict['id']
    fs_images.delete(id)
    
    post.images.remove('/images/' + id)
    post.save()
    
    return Response(JSONEncoder().encode({}))
    
@view_config(route_name='file_upload')
def file_upload(request):
    json_data = {}
    if request.method != "POST":
        json_data['jsonrpc'] = "2.0"
        json_data['error'] = {"code": 100, "message": "잘못된 요청입니다."}
        json_data['id'] = "id"
    
        return Response(JSONEncoder().encode(json_data))
        
    id   = request.POST['id']
    name = request.POST['name']
    content_type = mimetypes.guess_type(name)[0]
    if not content_type:
        content_type = 'application/octet-stream'
    
    if 'chunk' in request.POST:
        if fs_files.exists(id):
            data  = Binary(request.POST['file'].file.read())
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

    return Response(JSONEncoder().encode(json_data))

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
def notfound_view(request):
    return {}

# for remember me implementation
def set_remember(request, id):
    now = datetime.utcnow()
    request.response.set_cookie('PersistentCookie.id',
                                value=id,
                                expires=now.replace(now.year + 1),
                                overwrite=True)

def reset_remember(request):
    request.response.delete_cookie('PersistentCookie.id')

def get_remember(request):
    id = request.cookies.get('PersistentCookie.id', '')
    
    if id:
        try:
            me = User.objects.with_id(ObjectId(id))
            return me 
        except:
            pass
        
    return None

@view_config(route_name='login', renderer='login.mako')
@forbidden_view_config(renderer='login.mako')
def login(request):
    from urlparse import urlparse

    url_login = urlparse(request.route_path('login'))
    url_referrer = urlparse(request.url)
    if url_referrer.path == url_login.path:
        url_referrer = urlparse(request.route_path('home')) # never user the login from itself as came_from
    log.debug("params: %s", request.params)
    
    came_from = request.params.get('came_from', url_referrer.path)
    log.debug("[%s] CAME FROM: %s", request.method, came_from)
    message = ''
    username = ''
    password = ''
    activate = ''

    if request.method == "GET":
        me = get_remember(request) 
        if me:
            log.info('remember me is success')
            headers = remember(request, me.username)
            return HTTPFound(location=came_from, headers=headers)    
                
        if 'user[username]' in request.params:
            username = request.params['user[username]']
            user = User.by_username(username)
            if user and user.activate == 'REQUESTED':
                activate = user.activate
    
    elif request.method == "POST":
        username = request.params['user[username]']
        password = request.params['user[password]']
        user = User.by_username(username)
        if user and user.activate == 'REQUESTED':
            user.set_password(password)
            user.groups.append('group:employee')
            user.save(safe=True)
            headers = remember(request, user.username)
            return HTTPFound(location=came_from, headers=headers)
        elif user and user.validate_password(password):
            headers = remember(request, username)
            request.response.headerlist.extend(headers)
    
            remember_me = request.params.get('user[remember_me]', '')
            if remember_me == 'on' :
                set_remember(request, str(user.id))
                log.debug("%s, %s", came_from, request.response.headers)
                return HTTPFound(location=came_from, headers=request.response.headers)
            else:
                reset_remember(request)
                request.response.headerlist.extend(headers)
                return HTTPFound(location=came_from, headers=request.response.headers)
            
        return HTTPFound(location=came_from)

    return dict(url= request.application_url + '/login',
                came_from=came_from,
                login=login,
                password=password,
                activate=activate,
                )

@view_config(route_name='logout')
def logout(request):
    headers = forget(request)
    reset_remember(request)
    request.response.headerlist.extend(headers)
    return HTTPFound(location=request.route_path('home'),
                     headers=request.response.headers)

@view_config(route_name='search_prefix')
def search_prefix(request):
    fts = FTS_engine()
    results = []
    if 'keyword' in request.params:
        prefix = request.params['keyword']
        if prefix:
            results = [keyword for keyword in fts.prefix('keyword', prefix)]
            log.debug("results : %s", results)
    elif 'user' in request.params:
        prefix = request.params['user']
        if prefix:
            results = [user for user in fts.prefix('user', prefix)]
    return Response(JSONEncoder().encode(results))

@view_config(route_name='search_all', renderer='search.mako', permission='account:view')
def search_all(request):
    log.debug(request.params)
    page = int(request.params.get('page', '1')) - 1
    rows = 10
    query = request.params.get('query', '')
    results = []
    
    if query:
        fts = FTS_engine()
    
        # 내 블로그 그룹을 찾는다.
        me = User.by_username(authenticated_userid(request))
        mygroup = [str(c.id) for c in Category.objects(Q(public=False)&(Q(owner=me)|Q(members=me)))]
        
        results = fts.search(query, collections=mygroup, start=page*rows, rows=rows)
        log.debug(results)
        
    return dict(results=results, query=query, page=page+1)

@view_config(route_name='search_user')
def search_user(request):
    json_data = {}
    name = request.matchdict['name']
    user = User.objects(Q(name=name)|Q(username=name)).first()
    
    if user:
        json_data['username'] = user.username
        json_data['name'] = user.name
        
    return Response(JSONEncoder().encode(json_data))

