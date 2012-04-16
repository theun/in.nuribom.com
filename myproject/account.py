# -*- coding: utf-8 -*- 

import json
from datetime import datetime

from pyramid.httpexceptions import HTTPFound
from pyramid.view import view_config
from pyramid.response import Response

from .models import *
from .views import log

# 가족 관계 종류
relations = [u'배우자',
             u'자녀',
             ]
UNSELECT_VALUE = u'선택'

class AccountView(object):
    def __init__(self, request):
        self.request = request
        self.user = User.by_username(request.matchdict['username'])
        
    @view_config(route_name='account_main', 
                 renderer='account/main.mako',
                 permission='account:view')
    def account_main(self):
        return dict(user=self.user)

    @view_config(route_name='account_info_save',
                 renderer='json',
                 permission='account:save',
                 request_method='POST')
    def account_info_save(self):
        is_error = False
        json_data = {}
        
        params = self.request.params
        log.warn(params)
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
                if isinstance(self.user[params['id']], datetime):
                    self.user[params['id']] = datetime.strptime(params[params['id']], '%Y-%m-%d')
                else:
                    self.user[params['id']] = params[params['id']]
            
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
                del self.user.schools[int(params['id'])]
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
        log.warn('account_info_get: username=%s, category=%s, id=%s' % 
                 (self.request.matchdict['username'],
                  self.request.matchdict['category'],
                  self.request.params['id']))
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
        if self.user.photo.get() is None:
            response = Response(content_type='image/gif')
            response.app_iter = open('myproject/static/images/unknown.gif', 'rb')
        else:
            content_type = self.user.photo.content_type.encode('ascii')
            log.warn("ContentType: %s" % content_type)
            response = Response(content_type=content_type)
            response.body_file = self.user.photo
            
        return response 
                 
    @view_config(route_name='account_photo',
                 permission='account:edit', 
                 request_method='POST')
    def account_photo_post(self):
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

    def _save_family_info(self, request):
        log.warn('begin of _save_family_info')
        params = request.params.mixed()
        log.warn('after mixed')
        
        # 사용자 정보 저장
        if 'user_save' in params:
            if params['birthday_year'] == UNSELECT_VALUE or \
               params['birthday_month'] == UNSELECT_VALUE or \
               params['birthday_day'] == UNSELECT_VALUE:
                self.request.session.flash(u'생일을 잘못 입력하였습니다.')
            else:
                self.user.birthday.year = int(params['birthday_year'])
                self.user.birthday.month = int(params['birthday_month'])
                self.user.birthday.day = int(params['birthday_day'])
                self.user.save(safe=True)
        # 가족 정보 저장
        elif 'family_save' in params:
            log.warn(params)
            if params['birthday[year]'] == UNSELECT_VALUE or \
               params['birthday[month]'] == UNSELECT_VALUE or \
               params['birthday[day]'] == UNSELECT_VALUE:
                self.request.session.flash(u'생일을 잘못 입력하였습니다.')
            elif params['family_relation'] == UNSELECT_VALUE:
                self.request.session.flash(u'관계을 선택하세요.')
            else:
                if params['family_save'] == '':
                    # 가족 정보 추가 
                    family = Family() 
                    self.user.families.append(family)
                else:
                    family = self.user.families[int(params['family_save'])]
                family.name = params['family_name'].strip()
                family.relation = params['family_relation']
                family.birthday = datetime(int(params['birthday[year]']),
                                           int(params['birthday[month]']),
                                           int(params['birthday[day]']),
                                           0, 0)
                self.user.save(safe=True)
            
        return HTTPFound(self.request.route_url('account_info',
                                                username=self.user.username,
                                                category=params['category']))
    
    def _save_school_info(self, request):
        params = request.params.mixed()
        
        # 학교 정보 저장
        if 'school_save' in params:
            i = int(params['school_save'])
            params['name_%d' % i] = params['name_%d' % i].strip() 
            params['major_%d' % i] = params['major_%d' % i].strip()
            params['graduate_year_%d' % i] = params['graduate_year_%d' % i].strip() 
            if len(params['name_%d' % i]) == 0:
                self.request.session.falsh(u'학교이름을 입력하세요.')
            elif len(params['graduate_year_%d' % i]) < 4 or \
                 params['graduate_month_%d' % i] == UNSELECT_VALUE or \
                 params['graduate_day_%d' % i] == UNSELECT_VALUE:
                self.request.session.flash(u'날짜을 잘못 입력하였습니다.')
            else:
                school = self.user.schools[i]
                school.name = params['name_%d' % i]
                school.type = params['type_%d' % i]
                school.major = params['major_%d' % i]
                if params['degree_%d' % i] != UNSELECT_VALUE: 
                    school.degree = params['degree_%d' % i]
                school.graduate_date = datetime(int(params['graduate_year_%d' % i]),
                                                int(params['graduate_month_%d' % i]),
                                                int(params['graduate_day_%d' % i]),
                                                0, 0)
                self.user.save(safe=True)
        # 학교 정보 추가 
        elif 'school_add' in params:
            params['name'] = params['name'].strip() 
            params['major'] = params['major'].strip()
            params['graduate_year'] = params['graduate_year'].strip() 
            if len(params['name']) == 0:
                self.request.session.falsh(u'학교이름을 입력하세요.')
            elif len(params['graduate_year']) < 4 or \
                 params['graduate_month'] == UNSELECT_VALUE or \
                 params['graduate_day'] == UNSELECT_VALUE:
                self.request.session.flash(u'날짜을 잘못 입력하였습니다.')
            else:
                school = School()
                school.name = params['name']
                school.type = params['type']
                school.major = params['major']
                if params['degree'] != UNSELECT_VALUE: 
                    school.degree = params['degree']
                school.graduate_date = datetime(int(params['graduate_year']),
                                                int(params['graduate_month']),
                                                int(params['graduate_day']),
                                                0, 0)
                self.user.schools.append(school)
                self.user.save(safe=True)
        # 학교 정보 삭제
        elif 'school_delete' in params:
            del self.user.schools[int(params['school_delete'])]
            self.user.save(safe=True)

        return HTTPFound(self.request.route_url('account_info',
                                                username=self.user.username,
                                                category=params['category']))
    
    def _save_carrier_info(self, request):
        params = request.params.mixed()
        
        # 사용자 정보 저장
        if 'user_save' in params:
            params['job_summary'] = params['job_summary'].strip() 
            if len(params['job_summary']) > 0:
                self.user.job_summary = params['job_summary']
        # 경력 정보 저장
        elif 'carrier_save' in params:
            i = int(params['carrier_save'])
            params['company_name_%d' % i] = params['company_name_%d' % i].strip() 
            params['join_year_%d' % i] = params['join_year_%d' % i].strip() 
            params['leave_year_%d' % i] = params['leave_year_%d' % i].strip()
            params['summary_%d' % i] = params['summary_%d' % i].strip() 
            if len(params['company_name_%d' % i]) == 0:
                self.request.session.falsh(u'회사이름을 입력하세요.')
            elif len(params['join_year_%d' % i]) < 4 or \
               params['join_month_%d' % i] == UNSELECT_VALUE or \
               params['join_day_%d' % i] == UNSELECT_VALUE or \
               len(params['leave_year_%d' % i]) < 4 or \
               params['leave_month_%d' % i] == UNSELECT_VALUE or \
               params['leave_day_%d' % i] == UNSELECT_VALUE:
                self.request.session.flash(u'날짜을 잘못 입력하였습니다.')
            else:
                carrier = self.user.carriers[i]
                carrier.company_name = params['company_name_%d' % i]
                carrier.join_date  = datetime(int(params['join_year_%d' % i]),
                                              int(params['join_month_%d' % i]),
                                              int(params['join_day_%d' % i]),
                                              0, 0)
                carrier.leave_date = datetime(int(params['leave_year_%d' % i]),
                                              int(params['leave_month_%d' % i]),
                                              int(params['leave_day_%d' % i]),
                                              0, 0)
                carrier.job_summary = params['summary_%d' % i]
                self.user.save(safe=True)
        # 경력 정보 추가 
        elif 'carrier_add' in params:
            params['company_name'] = params['company_name'].strip() 
            params['join_year'] = params['join_year'].strip() 
            params['leave_year'] = params['leave_year'].strip()
            params['summary'] = params['summary'].strip() 
            if len(params['company_name']) == 0:
                self.request.session.falsh(u'회사이름을 입력하세요.')
            elif len(params['join_year']) < 4 or \
               params['join_month'] == UNSELECT_VALUE or \
               params['join_day'] == UNSELECT_VALUE or \
               len(params['leave_year']) < 4 or \
               params['leave_month'] == UNSELECT_VALUE or \
               params['leave_day'] == UNSELECT_VALUE:
                self.request.session.flash(u'날짜을 잘못 입력하였습니다.')
            else:
                carrier = Carrier()
                carrier.company_name = params['company_name']
                carrier.join_date  = datetime(int(params['join_year']),
                                              int(params['join_month']),
                                              int(params['join_day']),
                                              0, 0)
                carrier.leave_date = datetime(int(params['leave_year']),
                                              int(params['leave_month']),
                                              int(params['leave_day']),
                                              0, 0)
                carrier.job_summary = params['summary']
                self.user.carriers.append(carrier)
                self.user.save(safe=True)
        # 학교 정보 삭제
        elif 'carrier_delete' in params:
            del self.user.carriers[int(params['carrier_delete'])]
            self.user.save(safe=True)

        return HTTPFound(self.request.route_url('account_info',
                                                username=self.user.username,
                                                category=params['category']))
    