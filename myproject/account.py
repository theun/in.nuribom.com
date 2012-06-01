# -*- coding: utf-8 -*- 

import json
from datetime import datetime

from pyramid.httpexceptions import HTTPFound
from pyramid.view import view_config
from pyramid.response import Response

from .models import *
from .views import log
from functools import cmp_to_key 

# 가족 관계 종류
relations = [u'배우자',
             u'자녀',
             ]
UNSELECT_VALUE = u'선택'

class AccountView(object):
    def __init__(self, request):
        self.request = request
        if 'username' in request.matchdict:
            self.user = User.by_username(request.matchdict['username'])
        
    @view_config(route_name='account_main', 
                 renderer='blog/blog_list.mako',
                 permission='account:view')
    def account_main(self):
        posts = Post.objects(Q(author=self.user) | Q(comments__author=self.user)).order_by('-published')
        return dict(posts=posts, category='')

    @view_config(route_name='employees', 
                 renderer='employees.mako',
                 permission='account:view')
    def employees(self):
        order_by = self.request.params['sort'] if 'sort' in self.request.params else 'employee_id'
        reverse = True if 'reverse' in self.request.params else False 
        
        if order_by == 'rank':
            return dict(users=sorted(User.objects(Q(join_date__ne='') & Q(leave_date='')), key=cmp_to_key(compare_rank), reverse=reverse))
        else:
            if reverse:
                order_by = '-' + order_by
            return dict(users=User.objects(Q(join_date__ne='') & Q(leave_date='')).order_by(order_by))

    @view_config(route_name='account_info_save',
                 renderer='json',
                 permission='account:save',
                 request_method='POST')
    def account_info_save(self):
        is_error = False
        json_data = {}
        
        params = self.request.params
        if self.request.matchdict['category'] == 'basic':
            if params['id'] == 'password':
                if params['old_password'] != '' or params['new_password'] != '' or params['confirm_password'] != '':
                    # 암호를 변경한다.
                    if not self.user.validate_password(params['old_password']):
                        json_data['message'] = u'현재 암호를 잘못 입력하였습니다.'
                        is_error = True
                    elif params['new_password'] == '' or params['new_password'] != params['confirm_password']:
                        json_data['message'] = u'변경할 암호를 잘못 입력하였습니다.'
                        is_error = True
                    else:
                        self.user.set_password(params['new_password'])
                        json_data['message'] = u'암호가 변경되었습니다.'
            else:
                if params['id'] in ['birthday', 'join_date', 'leave_date']:
                    self.user[params['id']] = datetime.strptime(params[params['id']], '%Y-%m-%d')
                    json_data[params['id']] = str(self.user[params['id']].date())
                else:
                    self.user[params['id']] = params[params['id']]
                    json_data[params['id']] = self.user[params['id']]
                json_data['id'] = params['id']
            
        elif self.request.matchdict['category'] == 'family':
            if 'action' in params and params['action'] == 'delete':
                del self.user.families[int(params['id'])]
                json_data['message'] = u'삭제 되었습니다.'
            elif params['name'].strip() == '':
                json_data['message'] = u'이름을 입력하세요'
                is_error = True
            else:
                family_id = int(params['id'])
                if family_id >= len(self.user.families):
                    family = Family()
                else:
                    family = self.user.families[family_id]
                family.name = params['name'].strip()
                family.relation = params['relation']
                family.birthday = datetime.strptime(params['birthday'], '%Y-%m-%d')
                
                if family_id >= len(self.user.families):
                    self.user.families.append(family)
                
                json_data['id'] = params['id']
                json_data['name'] = family.name
                json_data['relation'] = family.relation
                json_data['birthday'] = str(family.birthday.date())
                #json_data['message'] = u'입력하신 내용이 변경되었습니다.'
        elif self.request.matchdict['category'] == 'school':
            if 'action' in params and params['action'] == 'delete':
                del self.user.schools[int(params['id'])]
            elif params['name'].strip() == '':
                json_data['message'] = u'학교이름을 입력하세요'
                is_error = True
            else:
                school_id = int(params['id'])
                if school_id >= len(self.user.schools):
                    school = School()
                else:
                    school = self.user.schools[school_id]
                school.name = params['name'].strip()
                school.type = params['type']
                school.major = params['major'].strip()
                school.degree = params['degree']
                school.graduate_date = datetime.strptime(params['graduate_date'], '%Y-%m-%d')
                
                if school_id >= len(self.user.schools):
                    self.user.schools.append(school)
                
                json_data['id'] = params['id']
                json_data['name'] = school.name
                json_data['type'] = school.type
                json_data['major'] = school.major
                json_data['degree'] = school.degree
                json_data['graduate_date'] = str(school.graduate_date.date())
        elif self.request.matchdict['category'] == 'carrier':
            if 'action' in params and params['action'] == 'delete':
                del self.user.carriers[int(params['id'])]
            elif params['company_name'].strip() == '':
                json_data['message'] = u'회사이름을 입력하세요'
                is_error = True
            else:
                work_id = int(params['id'])
                if work_id >= len(self.user.carriers):
                    work = Carrier()
                else:
                    work = self.user.carriers[work_id]
                work.company_name = params['company_name'].strip()
                work.join_date = datetime.strptime(params['join_date'], '%Y-%m-%d')
                work.leave_date = datetime.strptime(params['leave_date'], '%Y-%m-%d')
                work.job_summary = params['job_summary']
                
                if work_id >= len(self.user.carriers):
                    self.user.carriers.append(work)
                
                json_data['id'] = params['id']
                json_data['company_name'] = work.company_name
                json_data['join_date'] = str(work.join_date.date())
                json_data['leave_date'] = str(work.leave_date.date())
                json_data['job_summary'] = work.job_summary
                
        if not is_error:
            self.user.save(safe=True)

        return Response(json.JSONEncoder().encode(json_data))
    
    @view_config(route_name='account_info_get',
                 permission='account:view', 
                 request_method='GET')
    def account_info_get(self):
        json_data = {}
        params = self.request.params
        if self.request.matchdict['category'] == 'basic':
            if params['id'] == 'password':
                json_data[params['id']] = 'itssecret'
            if isinstance(self.user[params['id']], datetime):
                json_data[params['id']] = str(self.user[params['id']].date())
            else:  
                json_data[params['id']] = self.user[params['id']]
        elif self.request.matchdict['category'] == 'family':
            family_id = int(params['id'])
            if 'id' not in params or params['id'].strip() == '':
                json_data['message'] = u'가족 ID가 잘못 지정되었습니다.'
            elif family_id >= len(self.user.families):
                json_data['name'] = ''
                json_data['relation'] = ''
                json_data['birthday'] = ''
            else:
                family = self.user.families[family_id]
                json_data['name'] = family.name
                json_data['relation'] = family.relation
                json_data['birthday'] = str(family.birthday.date())
        elif self.request.matchdict['category'] == 'school':
            school_id = int(params['id'])
            if 'id' not in params or params['id'].strip() == '':
                json_data['message'] = u'학교 ID가 잘못 지정되었습니다.'
            elif school_id >= len(self.user.schools):
                json_data['name'] = ''
                json_data['type'] = ''
                json_data['major'] = ''
                json_data['degree'] = ''
                json_data['graduate_date'] = ''
            else:
                school = self.user.schools[school_id]
                json_data['name'] = school.name
                json_data['type'] = school.type
                json_data['major'] = school.major
                json_data['degree'] = school.degree
                json_data['graduate_date'] = str(school.graduate_date.date())
        elif self.request.matchdict['category'] == 'carrier':
            work_id = int(params['id'])
            if 'id' not in params or params['id'].strip() == '':
                json_data['message'] = u'경력 ID가 잘못 지정되었습니다.'
            elif work_id >= len(self.user.carriers):
                json_data['company_name'] = ''
                json_data['join_date'] = ''
                json_data['leave_date'] = ''
                json_data['job_summary'] = ''
            else:
                json_data['id'] = params['id']
                work = self.user.carriers[work_id]
                json_data['company_name'] = work.company_name
                json_data['join_date'] = str(work.join_date.date())
                json_data['leave_date'] = str(work.leave_date.date())
                json_data['job_summary'] = work.job_summary
            
        return Response(json.JSONEncoder().encode(json_data))

    @view_config(route_name='account_photo',
                 request_method='GET')
    def account_photo_get(self):
        if self.user is None or self.user.photo.get() is None:
            response = Response(content_type='image/png')
            response.app_iter = open('myproject/static/images/unknown.png', 'rb')
        else:
            content_type = self.user.photo.content_type.encode('ascii')
            response = Response(content_type=content_type)
            response.body_file = self.user.photo
            
        return response 
                 
    @view_config(route_name='account_photo',
                 permission='account:edit', 
                 request_method='POST')
    def account_photo_post(self):
        log.warn(self.request.POST)
        import mimetypes
        
        json_data = {}
        filename = self.request.POST['photo'].filename
        content_type = mimetypes.guess_type(filename)[0]
        if content_type:
            if self.user.photo.grid_id:
                self.user.photo.replace(self.request.POST['photo'].file,
                                        filename=filename,
                                        content_type=content_type)
            else:
                self.user.photo.put(self.request.POST['photo'].file,
                                    filename=filename, 
                                    content_type=content_type)
            self.user.save(safe=True) 
            json_data['message'] = u''
        else:
            json_data['message'] = u'인식할 수 없는 파일입니다.'
            
        return Response(json.JSONEncoder().encode(json_data)) 
                 
    @view_config(route_name='account_info', 
                 renderer='account/info.mako',
                 permission='account:edit', 
                 request_method='GET')
    def account_info(self):
        params = dict(user=self.user)

        # 가족 정보 삭제
        action = self.request.params['action'] if 'action' in self.request.params else ''
        target = self.request.params['target'] if 'target' in self.request.params else ''
        if action == 'delete' and target != '':
            del self.user[self.request.matchdict['category']][int(target)]
            self.user.save(safe=True)

        return params
