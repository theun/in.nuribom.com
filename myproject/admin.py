# -*- coding: utf-8 -*- 

import json
import bson
import re
import transaction

from pyramid.httpexceptions import HTTPFound
from pyramid.exceptions import NotFound
from pyramid.view import view_config
from pyramid.response import Response

from .models import *
from .views import log
from datetime import datetime
from functools import cmp_to_key 
from pyramid_mailer import get_mailer
from pyramid_mailer.mailer import Mailer
from pyramid_mailer.message import Message

class AdminView(object):
    
    def __init__(self, request):
        self.request = request

    @view_config(route_name='admin_account', 
                 renderer='admin/account.mako', 
                 permission='admin:view')
    def admin_account(self):
        if self.request.method == 'GET':
            order_by = self.request.params['sort'] if 'sort' in self.request.params else 'employee_id'
            reverse = True if 'reverse' in self.request.params else False 
            
            if order_by == 'rank':
                return dict(users=sorted(User.objects, key=cmp_to_key(compare_rank), reverse=reverse))
            else:
                if reverse:
                    order_by = '-' + order_by
                return dict(users=User.objects.order_by(order_by))
        else:
            for id in [x for x in self.request.params['id-list'].split(',') if x]:
                log.info("'%s'", id)
                User.by_username(id).delete()

            return Response(json.JSONEncoder().encode({}))

    @view_config(route_name='admin_account_duplicate') 
    def admin_check_duplicate(self):
        json_data = {}
        json_data['result'] = User.by_username(self.request.matchdict['username']) is not None
        log.warn(json_data['result'])
        
        return Response(json.JSONEncoder().encode(json_data))
        
    @view_config(route_name='admin_account_activate_request') 
    def admin_account_activate_request(self):
        body = u"""
        <p>안녕하세요. %s님.</p>
        <p></p>
        <p>본 메일은 누리봄 사내 인트라넷인 <strong>누리인</strong>에서 %s님의 누리인 계정을 활성화하기 위해서 보낸 것입니다.</p>
        <p>누리인 계정을 활성화하시려면 <a href='http://%s%s'>여기</a>를 누르세요</p>
        <p></p>
        <p>감사합니다.</p>
        <p>서비스 개발팀 드림</p>
        """
        host = self.request.params['host']
        
        for id in self.request.params['id-list'].split(','):
            user = User.by_username(id.strip())

            if user and not user.password and not user.leave_date:
                path = self.request.route_path("admin_account_activate", username=user.username)
                user.activate = 'REQUESTED'
                user.save()
                html = body % (user.name, user.name, host, path) 
                message = Message(subject=u"[누리인] 계정 활성화 요청",
                                  sender="theun@nuribom.com",
                                  recipients=[user.email],
                                  html=html)
                thread_mailer.send(message)

        return Response(json.JSONEncoder().encode({}))
        
    @view_config(route_name='admin_account_activate') 
    def admin_account_activate(self):
        user = User.by_username(self.request.matchdict['username'])
        if user.activate == 'REQUESTED':
            return HTTPFound(location=self.request.route_path('login') + "?login=" + user.username)
        else:
            raise NotFound

        return Response(json.JSONEncoder().encode({}))
        
    @view_config(route_name='admin_account_deactivate') 
    def admin_account_deactivate(self):
        for id in self.request.params['id-list'].split(','):
            user = User.by_username(id.strip())
            if user:
                user.password = ''
                user.activate = ''
                user.save()

        return Response(json.JSONEncoder().encode({}))
        
    @view_config(route_name='admin_account_edit', 
                 renderer='admin/account_edit.mako', 
                 permission='admin:view')
    def admin_account_edit(self):
        username = self.request.matchdict['username']
        if username == '__new__':
            user = User()
        else:
            user = User.by_username(username)
        
        if 'perms' in self.request.params:
            log.warn(self.request.params['perms'])
            user.permissions = self.request.params['perms'].split(',')
            user.save(safe=True)
            return Response(json.JSONEncoder().encode({}))
            
        params = self.request.POST

        if 'save' in self.request.POST:
            log.warn(self.request.params)
            user.name = params['name']
            user.username = params['username'] 
            user.email = user.username + "@nuribom.com"
            user.employee_id = params['employee_id']
            user.birthday = datetime.strptime(params['birthday'], '%Y-%m-%d') if params['birthday'] else None
            user.mobile = params['mobile']
            user.phone = params['phone']
            user.phone1 = params['phone1']
            user.grade = params['grade'] if params['grade'] != u'선택' else ''
            if re.match(r'\d{6}-\d{7}', params['social_id'].strip()):
                user.set_social_id(params['social_id'][:6] + params['social_id'][7:])
            user.en_name = params['en_name']
            user.team = params['team']
            user.join_rank = params['join_rank'] if params['join_rank'] != u'선택' else ''
            user.join_date = datetime.strptime(params['join_date'], '%Y-%m-%d') if params['join_date'] else None
            user.leave_date = datetime.strptime(params['leave_date'], '%Y-%m-%d') if params['leave_date'] else None
            user.job_summary = params['job_summary']
            user.email1 = params['email1']
            user.address = params['address']
            user.address1 = params['address1']
            
            user.save(safe=True)
            
            return HTTPFound(location=self.request.route_path('admin_account'))
        elif 'cancel' in self.request.POST:
            return HTTPFound(location=self.request.route_path('admin_account'))
        
        return dict(user=user)
    
    @view_config(route_name='admin_team', 
                 renderer='admin/team.mako', 
                 permission='admin:view')
    def admin_team(self):
        # validate team member
        log.info("admin_team")
        for team in Team.objects:
            dirty = False
            try:
                team.leader.name
            except:
                team.leader = None
                dirty = True
            for p in team.parents[:]:
                try:
                    p.name
                except:
                    team.parents.remove(p)
                    dirty = True
            for c in team.children[:]:
                try:
                    c.name
                except:
                    team.children.remove(c)
                    dirty = True
            if dirty:
                team.save(safe=True)

        return dict(teams=Team.objects.order_by('name'))

    @view_config(route_name='admin_team_edit', 
                 renderer='admin/team_edit.mako', 
                 permission='admin:view')
    def admin_team_edit(self):
        if self.request.method == 'GET':
            try:
                team_id = bson.ObjectId(self.request.matchdict['id'])
                team = Team.objects.with_id(team_id)
            except:
                raise NotFound
    
            users = User.objects(Q(team=team.name) & Q(leave_date=''))
            
            order_by = self.request.params['sort'] if 'sort' in self.request.params else 'name'
            reverse = True if 'reverse' in self.request.params else False 
            
            if order_by == 'rank':
                users = sorted(users, key=cmp_to_key(compare_rank), reverse=reverse)
            else:
                if reverse:
                    order_by = '-' + order_by
                users = users.order_by(order_by)
    
            return dict(members=users,
                        team=team
                        )
        else:
            json_data = {}
            try:
                team_id = bson.ObjectId(self.request.matchdict['id'])
                team = Team.objects.with_id(team_id)
            except:
                raise NotFound
            
            leader = User.by_username(self.request.params['leader'])
            team.leader = leader
            team.save(safe=True)
            return Response(json.JSONEncoder().encode(json_data))

    @view_config(route_name='admin_team_save') 
    def admin_team_save(self):
        json_data = {}
        try:
            save_id = self.request.matchdict['id']
            if save_id == '__new__':
                team = Team()
            else:
                team_id = bson.ObjectId(save_id)
                team = Team.objects.with_id(team_id)
            
                # team을 자식으로 가진 모든 레코드를 삭제한다.
                for t in Team.objects(children=team):
                    t.children.remove(team)
                    t.save(safe=True)

            if 'parent' in self.request.params and self.request.params['parent']:
                try:
                    parent_id = bson.ObjectId(self.request.params['parent'])
                    parent = Team.objects.with_id(parent_id)
                    team.parents = parent.parents[:]
                    team.parents.append(parent)
                except:
                    raise NotFound
            else:
                for p in team.parents:
                    team.parents.remove(p)
                
            if 'name' in self.request.params and self.request.params['name']:
                User.objects(team=team.name).update(set__team=self.request.params['name'])
                team.name = self.request.params['name']
                
            team.save(safe=True)

            if 'parent' in self.request.params and self.request.params['parent']:
                parent.children.append(team)
                parent.save(safe=True)
            
            json_data['id'] = str(team.id)
            json_data['name'] = team.name
        except:
            raise NotFound
        
        return Response(json.JSONEncoder().encode(json_data))

    @view_config(route_name='admin_team_del') 
    def admin_team_del(self):
        try:
            for id in self.request.params['id-list'].split(','):
                team_id = bson.ObjectId(id)
                team = Team.objects.with_id(team_id)
                User.objects(team=team.name).update(set__team='')
                # team을 parent로 가진 모든 레코드를 삭제한다.
                for t in Team.objects(parents=team):
                    t.parents.remove(team)
                    t.save(safe=True)
                # team을 자식으로 가진 모든 레코드를 삭제한다.
                for t in Team.objects(children=team):
                    t.children.remove(team)
                    t.save(safe=True)
                team.delete()
        except:
            raise NotFound
        
        return Response(json.JSONEncoder().encode({}))

    @view_config(route_name='admin_team_member_add', 
                 renderer='admin/team_member_add.mako', 
                 permission='admin:edit')
    def admin_team_member_add(self):
        if self.request.method == 'GET':
            try:
                team_id = bson.ObjectId(self.request.matchdict['id'])
                team = Team.objects.with_id(team_id)
            except:
                raise NotFound
    
            users = User.objects(Q(team__ne=team.name) & Q(leave_date=''))
            
            order_by = self.request.params['sort'] if 'sort' in self.request.params else 'name'
            reverse = True if 'reverse' in self.request.params else False 
            
            if order_by == 'rank':
                users = sorted(users, key=cmp_to_key(compare_rank), reverse=reverse)
            else:
                if reverse:
                    order_by = '-' + order_by
                users = users.order_by(order_by)
    
            return dict(users=users,
                        team=team
                        )
        else:
            try:
                team_id = bson.ObjectId(self.request.matchdict['id'])
                team = Team.objects.with_id(team_id)
            except:
                raise NotFound
            
            for username in self.request.params['id-list'].split(','):
                User.by_username(username).update(set__team=team.name)

            return Response(json.JSONEncoder().encode({}))
            
            
    @view_config(route_name='admin_team_member_del') 
    def admin_team_member_del(self):
        try:
            team_id = bson.ObjectId(self.request.matchdict['id'])
            team = Team.objects.with_id(team_id)
        except:
            raise NotFound
        
        for username in self.request.params['id-list'].split(','):
            user = User.by_username(username) 
            if username == team.leader.username:
                team.leader = None
            user.update(set__team='')
            
        team.save(safe=True)

        return Response(json.JSONEncoder().encode({}))

    @view_config(route_name='admin_permission', 
                 renderer='admin/permission.mako', 
                 permission='admin:view')
    def admin_permission(self):
        return dict(permissions=Permission.objects)

    @view_config(route_name='admin_permission_edit', 
                 renderer='admin/permission_edit.mako', 
                 permission='admin:view')
    def admin_permission_edit(self):
        if self.request.method == 'GET':
            try:
                perm_id = bson.ObjectId(self.request.matchdict['id'])
                perm = Permission.objects.with_id(perm_id)
            except:
                raise NotFound
    
            users = User.objects(Q(permissions=perm.name) & Q(leave_date=''))
            
            order_by = self.request.params['sort'] if 'sort' in self.request.params else 'name'
            reverse = True if 'reverse' in self.request.params else False 
            
            if order_by == 'rank':
                users = sorted(users, key=cmp_to_key(compare_rank), reverse=reverse)
            else:
                if reverse:
                    order_by = '-' + order_by
                users = users.order_by(order_by)
    
            return dict(members=users,
                        permission=perm
                        )

    @view_config(route_name='admin_permission_save', 
                 renderer='json', 
                 request_method='POST',
                 permission='admin:edit')
    def admin_permission_save(self):
        json_data = {}
        try:
            save_id = self.request.matchdict['id']
            if save_id == '__new__':
                perm = Permission()
            else:
                perm_id = bson.ObjectId(save_id)
                perm = Permission.objects.with_id(perm_id)
                
            perm.name = self.request.params['name']
            perm.save(safe=True)
            
            json_data['id'] = str(perm.id)
            json_data['name'] = perm.name
        except:
            raise NotFound
        
        return Response(json.JSONEncoder().encode(json_data))

    @view_config(route_name='admin_permission_del', 
                 renderer='json', 
                 request_method='POST',
                 permission='admin:edit')
    def admin_permission_del(self):
        try:
            for id in self.request.params['id-list'].split(','):
                perm_id = bson.ObjectId(id)
                perm = Permission.objects.with_id(perm_id)
                perm.delete()
        except:
            raise NotFound
        
        return Response(json.JSONEncoder().encode({}))

    @view_config(route_name='admin_permission_member_add', 
                 renderer='admin/permission_member_add.mako', 
                 permission='admin:edit')
    def admin_permission_member_add(self):
        if self.request.method == 'GET':
            try:
                perm_id = bson.ObjectId(self.request.matchdict['id'])
                perm = Permission.objects.with_id(perm_id)
            except:
                raise NotFound
    
            users = User.objects(Q(permissions__ne=perm.name) & Q(leave_date=''))
            
            order_by = self.request.params['sort'] if 'sort' in self.request.params else 'name'
            reverse = True if 'reverse' in self.request.params else False 
            
            if order_by == 'rank':
                users = sorted(users, key=cmp_to_key(compare_rank), reverse=reverse)
            else:
                if reverse:
                    order_by = '-' + order_by
                users = users.order_by(order_by)
    
            return dict(users=users,
                        permission=perm
                        )
        else:
            try:
                perm_id = bson.ObjectId(self.request.matchdict['id'])
                perm = Permission.objects.with_id(perm_id)
            except:
                raise NotFound
            
            for username in self.request.params['id-list'].split(','):
                user = User.by_username(username)
                user.permissions.append(perm.name)
                user.save(safe=True)

            return Response(json.JSONEncoder().encode({}))
            
            
    @view_config(route_name='admin_permission_member_del') 
    def admin_permission_member_del(self):
        try:
            perm_id = bson.ObjectId(self.request.matchdict['id'])
            perm = Permission.objects.with_id(perm_id)
        except:
            raise NotFound
        
        for username in self.request.params['id-list'].split(','):
            user = User.by_username(username) 
            user.permissions.remove(perm.name)
            user.save(safe=True)

        return Response(json.JSONEncoder().encode({}))

    @view_config(route_name='admin_group', 
                 renderer='admin/group.mako', 
                 permission='admin:view')
    def admin_group(self):
        return dict(groups=Group.objects)

    @view_config(route_name='admin_group_edit', 
                 renderer='admin/group_edit.mako', 
                 permission='admin:view')
    def admin_group_edit(self):
        if self.request.method == 'GET':
            try:
                group_id = bson.ObjectId(self.request.matchdict['id'])
                group = Group.objects.with_id(group_id)
            except:
                raise NotFound
    
            users = User.objects(Q(groups=group.name) & Q(leave_date=''))
            
            order_by = self.request.params['sort'] if 'sort' in self.request.params else 'name'
            reverse = True if 'reverse' in self.request.params else False 
            
            if order_by == 'rank':
                users = sorted(users, key=cmp_to_key(compare_rank), reverse=reverse)
            else:
                if reverse:
                    order_by = '-' + order_by
                users = users.order_by(order_by)
    
            return dict(members=users,
                        group=group
                        )

    @view_config(route_name='admin_group_save', 
                 renderer='json', 
                 request_method='POST',
                 permission='admin:edit')
    def admin_group_save(self):
        json_data = {}
        try:
            save_id = self.request.matchdict['id']
            if save_id == '__new__':
                group = Group()
            else:
                group_id = bson.ObjectId(save_id)
                group = Group.objects.with_id(group_id)
                
            group.name = 'group:' + self.request.params['name']
            
            if 'perms' in self.request.params and self.request.params['perms']:
                group.permissions = self.request.params['perms'].split(',')
                    
            group.save(safe=True)
            
            json_data['id'] = str(group.id)
            json_data['name'] = group.name
        except:
            raise NotFound
        
        return Response(json.JSONEncoder().encode(json_data))

    @view_config(route_name='admin_group_del', 
                 renderer='json', 
                 request_method='POST',
                 permission='admin:edit')
    def admin_group_del(self):
        try:
            for id in self.request.params['id-list'].split(','):
                group_id = bson.ObjectId(id)
                group = Group.objects.with_id(group_id)
                group.delete()
        except:
            raise NotFound
        
        return Response(json.JSONEncoder().encode({}))

    @view_config(route_name='admin_group_member_add', 
                 renderer='admin/group_member_add.mako', 
                 permission='admin:edit')
    def admin_group_member_add(self):
        if self.request.method == 'GET':
            try:
                group_id = bson.ObjectId(self.request.matchdict['id'])
                group = Group.objects.with_id(group_id)
            except:
                raise NotFound
    
            users = User.objects(Q(groups__ne=group.name) & Q(leave_date=''))
            
            order_by = self.request.params['sort'] if 'sort' in self.request.params else 'name'
            reverse = True if 'reverse' in self.request.params else False 
            
            if order_by == 'rank':
                users = sorted(users, key=cmp_to_key(compare_rank), reverse=reverse)
            else:
                if reverse:
                    order_by = '-' + order_by
                users = users.order_by(order_by)
    
            return dict(users=users,
                        group=group
                        )
        else:
            try:
                group_id = bson.ObjectId(self.request.matchdict['id'])
                group = Group.objects.with_id(group_id)
            except:
                raise NotFound
            
            for username in self.request.params['id-list'].split(','):
                if not username:
                    continue
                user = User.by_username(username)
                user.groups.append(group.name)
                user.save(safe=True)

            return Response(json.JSONEncoder().encode({}))
            
            
    @view_config(route_name='admin_group_member_del') 
    def admin_group_member_del(self):
        try:
            group_id = bson.ObjectId(self.request.matchdict['id'])
            group = Group.objects.with_id(group_id)
        except:
            raise NotFound
        
        for username in self.request.params['id-list'].split(','):
            user = User.by_username(username) 
            user.groups.remove(group.name)
            user.save(safe=True)

        return Response(json.JSONEncoder().encode({}))

    @view_config(route_name='admin_blog', 
                 renderer='admin/blog.mako', 
                 permission='admin:view')
    def admin_blog(self):
        if self.request.method == 'GET':
            order_by = self.request.params['sort'] if 'sort' in self.request.params else '-modified'
            reverse = True if 'reverse' in self.request.params else False 
            
            if order_by == 'author':
                return dict(posts=sorted(Post.objects, key=cmp_to_key(compare_author), reverse=reverse))
            else:
                if reverse:
                    order_by = '-' + order_by
                return dict(posts=Post.objects.order_by(order_by))
        else:
            log.warn(self.request.params)
            json_data = {}
            
            for blog_id in self.request.params.keys():
                Post.objects.with_id(blog_id).delete()

            return Response(json.JSONEncoder().encode(json_data))

    @view_config(route_name='admin_mail_test') 
    def admin_mail_test(self):
        body = u"""
        <p>안녕하세요. %s님.</p>
        <p></p>
        <p>본 메일은 누리봄 사내 인트라넷인 <strong>누리인</strong>에서 %s님의 메일 전송을 시험하기 위해서 보낸 것입니다.</p>
        <p>%s님의 메일 계정은 %s 입니다.</p>
        <p></p>
        <p>감사합니다.</p>
        <p>서비스 개발팀 드림</p>
        """
        for user in User.objects.all():
            html = body % (user.name, user.name, user.name, user.email) 
            message = Message(subject=u"[누리인] 메일 테스트 : %s님께" % user.name,
                              sender="theun@nuribom.com",
                              recipients=['theun0524@gmail.com'],
                              html=html)
            thread_mailer.send(message)
        
        return Response(json.JSONEncoder().encode({"test": "OK"}))

import Queue
import threading

class ThreadMailer(threading.Thread):
    """
    인덱스 추가/삭제를 위한 쓰레드
    """
    def __init__(self):
        threading.Thread.__init__(self)
        self.queue = Queue.Queue()
        self.mailer = Mailer(host="localhost",
                             username="mailuser",
                             password="mailpass123")
    
    def send(self, msg):
        self.queue.put(msg)
        
    def run(self):

        while True:
            # 큐에서 작업을 하나 가져온다
            msg = self.queue.get()
            self.mailer.send(msg)
            log.info(msg.subject)
            transaction.commit()
            log.info("MAIL COMMITTED!")
            
            # 작업 완료를 알리기 위해 큐에 시그널을 보낸다.
            self.queue.task_done()
    
    def end(self):
        self.queue.join()

