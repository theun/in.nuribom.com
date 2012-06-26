# -*- coding: utf-8 -*- 

import os
from datetime import datetime
from hashlib import sha1
from pyramid.security import (
                              Allow,
                              Everyone,
                              )
class RootFactory(object):
    __acl__ = [ (Allow, Everyone, 'view'),
                (Allow, 'group:editors', 'edit')]
    
    def __init__(self, request):
        pass

from mongoengine import *
from gridfs import GridFS

rank_db = ( u"사원-3 사원-2 사원-1 사원1 사원2 사원3 대리1 대리2 대리3 과장1 과장2 과장3 과장4 차장1 차장2 차장3 차장4 부장1 부장2 부장3 부장4 부장5 부장6 부장+ 부장".split(),
            u"연구원-4 연구원-3 연구원-2 연구원-1 연구원1 연구원2 연구원3 주임1 주임2 주임3 선임1 선임2 선임3 선임4 책임1 책임2 책임3 책임4 수석1 수석2 수석3 수석4 수석5 수석6 수석+".split() )
weekday = u"월요일 화요일 수요일 목요일 금요일 토요일 일요일".split()

def compare_rank(a, b):
    ranks = rank_db[0] + rank_db[1]

    rank1 = a.get_rank()
    rank2 = b.get_rank()
    if rank1 in ranks and rank2 in ranks:
        return ranks.index(rank1) - ranks.index(rank2)
    elif rank1 in ranks:
        return -1
    elif rank2 in ranks:
        return 1
    else:
        return cmp(rank1, rank2)
    
def compare_author(a, b):
    return cmp(a.author.name, b.author.name)

def groupfinder(userid, request):
    user = User.by_username(userid);
    groups = user and user.groups
    
    return groups or []

class Permission(Document):
    """
    시스템에 등록되는 권한에 대한 Field를 정의한다.
    
     name        : 퍼미션 이름
      
    """
    name = StringField()
    
class Group(Document):
    """
    시스템에 등록되는 권한그룹에 대한 Field를 정의한다.
    
     name        : 그룹 이름
     permissions : 그룹에 대한 퍼미션 목록 
      
    """
    name = StringField()
    permissions = ListField(StringField())
    
    def __unicode__(self):
        return "%s: %s" % (self.name, self.permissions)

class Family(EmbeddedDocument):
    """
    가족정보에 대한 EmbeddedField를 정의한다.
    
     name     : 가족 이름
     relation : 관계
     birthday : 생일
      
    """
    name = StringField()
    relation = StringField()
    birthday = DateTimeField()
    
    def __unicode(self):
        return "%s(%s) - %s" % (self.name,
                                str(self.birthday.date()),
                                self.relation)
    
class School(EmbeddedDocument):
    """
    학력정보에 대한 EmbeddedField를 정의한다.
    
     name   : 학교 이름
     type   : 종류 (초등학교, 중학교, 고등학교, 대학교, 대학원)
     major  : 전공
     degree : 학위
     graduated_date : 졸업일자
      
    """
    name = StringField()
    type = StringField()
    major = StringField()
    degree = StringField()
    graduate_date = DateTimeField()
    
    def __unicode__(self):
        return "%s%s(%s)" % (self.name, self.type, str(self.graduate_date.date()))
    
class Carrier(EmbeddedDocument):
    """
    경력정보에 대한 EmbeddedField를 정의한다.
    
     company_name : 회사 이름
     join_date    : 학력 (초등학교, 중학교, 고등학교, 대학교, 대학원)
     leave_date   : 졸업일자
      
    """
    company_name = StringField()
    join_date = DateTimeField()
    leave_date = DateTimeField()
    job_summary = StringField()
    
    def get_work_month(self):
        year = self.leave_date.year - self.join_date.year
        month = self.leave_date.month - self.join_date.month
        return year * 12 + month
    
    def __unicode__(self):
        return "%s(%s개월): (%s~%s)" % (self.company_name, 
                                      self.get_work_month(),
                                      str(self.join_date.date()),
                                      str(self.leave_date.date()))

class User(Document):
    
    """
    시스템에 등록되는 사용자에 대한 Field를 정의한다.
    
    permissions은 일반적으로 사용자가 속한 그룹의 퍼미션을 사용하지만
    permissions에 등록된 퍼미션은 사용자에게만 특별히 부여하는 권한이다.
    
     [기본정보]
     username     : 사용자 ID
     password     : 사용자 암호
     name         : 이름
     email        : e-mail
     email1       : 부가 e-mail (일반적으로 MSN 정보)
     birthday     : 생년월일
     mobile_phone : 휴대전화
     phone        : 유선 전화
     phone1       : 부가 전화
     address      : 기본 주소
     address1     : 부가 주소 (일반적으로 고향 주소)
     
     [가족정보]
     families     : 가족 관련 정보 목록
     
     [학력정보]
     schools      : 학력 관련 정보 목록
     
     [경력정보]
     carriers     : 경력 관련 정보 목록
     
     [보안정보]
     groups       : 사용자가 속한 그룹 목록
     permissions  : 사용자에게 별도로 부과하는 퍼미션
      
    """
    
    # 기본정보
    username = StringField(required=True, unique=True)
    password = StringField()
    name = StringField(max_length=50)
    email = StringField()
    email1 = StringField()
    birthday = DateTimeField()
    mobile = StringField(max_length=32)
    phone = StringField(max_length=32)
    phone1 = StringField(max_length=32)
    address = StringField()
    address1 = StringField()
    photo = FileField()
    
    # 가족정보
    families = ListField(EmbeddedDocumentField(Family))
    
    # 학력정보
    schools = ListField(EmbeddedDocumentField(School))
    
    # 경력정보
    carriers = ListField(EmbeddedDocumentField(Carrier))
    
    # 사원정보
    employee_id = StringField(max_length=5) #사번
    grade = StringField() #직급 : Junior, Senior, ..
    rank = StringField() #직위 : 부장, 선임, ...
    degree = StringField() #학위
    social_id = StringField() #암호화된 주민번호
    en_name = StringField() #영문이름
    team = StringField() #팀
    join_rank = StringField(max_length=32) #입사직위
    join_date = DateTimeField() #입사일
    leave_date = DateTimeField() #퇴사일
    job_summary = StringField() #업무요약
    
    # 보안정보
    groups = ListField(StringField())
    permissions = ListField(StringField())
    activate = StringField()
    
    # 알람정보
    alarms = ListField(StringField())
    
    def __unicode__(self):
        return self.name
    
    @classmethod
    def by_username(cls, username):
        return User.objects(username=username).first()

    def set_password(self, password):
        hashed_password = password

        if isinstance(password, unicode):
            password_8bit = password.encode('UTF-8')
        else:
            password_8bit = password

        salt = sha1()
        salt.update(os.urandom(60))
        hash = sha1()
        hash.update(password_8bit + salt.hexdigest())
        hashed_password = salt.hexdigest() + hash.hexdigest()

        if not isinstance(hashed_password, unicode):
            hashed_password = hashed_password.decode('UTF-8')

        self.password = hashed_password
        self.activate = ''

    def validate_password(self, password):
        hashed_pass = sha1()
        hashed_pass.update(password + self.password[:40])
        return self.password[40:] == hashed_pass.hexdigest()
    
    def set_social_id(self, social_id):
        hashed_sid = social_id

        if isinstance(social_id, unicode):
            sid_8bit = social_id.encode('UTF-8')
        else:
            sid_8bit = social_id

        salt = sha1()
        salt.update(os.urandom(60))
        hash = sha1()
        hash.update(sid_8bit + salt.hexdigest())
        hashed_sid = salt.hexdigest() + hash.hexdigest()

        if not isinstance(hashed_sid, unicode):
            hashed_sid = hashed_sid.decode('UTF-8')

        self.social_id = hashed_sid
        
    def validate_social_id(self, social_id):
        hashed_sid = sha1()
        hashed_sid.update(social_id + self.social_id[:40])
        return self.social_id[40:] == hashed_sid.hexdigest()

    def get_rank(self):
        found = False
        rank = ""

        if self.join_date is None:
            return self.join_rank
        
        join_years = datetime.now().year - self.join_date.year
        
        for ranks in rank_db:
            if self.join_rank in ranks:
                found = True
                if len(ranks) <= (ranks.index(self.join_rank) + join_years):
                    rank = ranks[-1]
                else:
                    rank = ranks[ranks.index(self.join_rank) + join_years]
                break
        
        if not found:
            rank = self.join_rank
             
        return rank
    
    def is_active_user(self):
        if not self.join_date or self.leave_date or self.activate or not self.password:
            return False
        
        return True
    
    def get_team_path(self):
        team = Team.objects(name=self.team).first()
        if team:
            return team.get_path()
        else:
            return ''

    def save(self, safe=True, force_insert=False, validate=True, write_options=None,
            cascade=None, cascade_kwargs=None, _refs=None):
        """
        DB에 User를 저장하고 검색엔진에 사용자를 업데이트 한다.
        """
        super(User, self).save(safe, force_insert, validate, write_options, cascade, cascade_kwargs, _refs)
        index.send_job(dict(action='add', id=str(self.id), collection='User'))
        
    def delete(self, safe=False):
        """
        DB에서 User를 삭제하고 검색엔진에서 사용자를 삭제한다.
        """
        index.send_job(dict(action='del', id=str(self.id), collection='User'))
        super(User, self).delete(safe)

    def update(self, **kwargs):
        super(User, self).update(**kwargs)
        index.send_job(dict(action='add', id=str(self.id), collection='User'))
        
class Comment(Document):
    
    """
    포스트된 글에 첨가되는 주석에 대한 Field를 정의한다.
    
     id      : 주석에 대한 ID
     content : 주석 내용
     name    : 주석을 첨가한 사람. 일반적으로 로그인한 사람이 자동 추가된다.
     posted  : 주석이 추가된 시간.
      
    """
    content = StringField()
    author = ReferenceField(User)
    posted = DateTimeField()
    
    def __unicode__(self):
        return self.content

class Post(Document):

    """
    블로그 상에 포스트되는 글에 대한 Field를 정의한다.
    
     title     : 글의 제목
     author    : 작성자. 일반적으로 로그인한 사람이 자동 추가된다.
     content   : 글의 내용
     published : 글의 작성 또는 수정된 시간.
     comment   : 글에 첨가되는 주석 목록.
     
     #TODO
     글의 종류를 추가해서 글이 개인의 블로그에 포스트될지 공지사항으로 표시될지를 결정할 필요가 있다.
      
    """
    title = StringField(required=True)
    author = ReferenceField(User)
    content = StringField()
    published = DateTimeField()
    category = ReferenceField('Category')
    images = ListField(StringField())
    files  = ListField(StringField())
    comments = ListField(ReferenceField(Comment))
    tags = ListField(StringField())
    
    def __unicode__(self):
        return self.title

    def update_tags(self, new_tags):
        # 신규 태그 목록 중에서 현재 목록에 없는 것은 추가한다.
        news = set([t.lower() for t in new_tags])
        olds = set(self.tags)
        for tag in news - olds:
            self.tags.append(tag)
            t = Tag.objects.get_or_create(name=tag, defaults={'ref': 0})[0]
            t.ref += 1
            t.save()

        # 현재 태그 목록 중에서 신규 태그 목록에 없는 것은 삭제한다.
        for tag in olds - news:
            self.tags.remove(tag)
            t = Tag.objects(name=tag).first()
            t.ref -= 1
            if t.ref == 0:
                t.delete()
            else:
                t.save()

        self.save()

    def _update_index(self):
        pass
    
    def save(self, safe=True, force_insert=False, validate=True, write_options=None,
            cascade=None, cascade_kwargs=None, _refs=None):
        """
        DB에 Post를 저장하고 검색엔진에 문서를 업데이트 한다.
        """
        super(Post, self).save(safe, force_insert, validate, write_options, cascade, cascade_kwargs, _refs)
        index.send_job(dict(action='add', id=str(self.id), collection='Post'))
        
    def delete(self, safe=False):
        """
        DB에서 Post를 삭제하고 검색엔진에서 문서를 삭제한다.
        """
        index.send_job(dict(action='del', id=str(self.id), collection='Post'))
        super(Post, self).delete(safe)

    def update(self, **kwargs):
        super(Post, self).update(**kwargs)
        index.send_job(dict(action='add', id=str(self.id), collection='Post'))
        
class Tag(Document):
    """
    블로그에 대한 태그 목록을 정의한다.
    
     name     : 태그 이름
     
    """
    name = StringField(unique=True)
    ref  = IntField()
    
    def __unicode__(self):
        return self.name

class Team(Document):
    """
    팀 계층도를 구현한다.
    
     name     : 팀이름
     leader   : 팀장
     members  : 팀 구성원 목록
    """
    
    name = StringField(required=True)
    leader = ReferenceField(User)
    parents = ListField(ReferenceField('Team'))
    children = ListField(ReferenceField('Team'))
    
    def __unicode__(self):
        return "%s[%s]" % (self.name, self.leader)
    
    def count(self):
        sum = 0
        for c in self.children:
            sum += c.count()
        return sum + len(User.objects(team=self.name))
    
    def get_path(self):
        path = ''
        for p in self.parents:
            path += p.name + ' > '
        path += self.name
            
        return path

class Category(Document):
    """
    블로그 그룹을 구현한다.
    
     name     : 블로그 그룹 이름 - Post.category와 동일한 이름
     owner    : 그룹 소유자
     members  : 그룹 구성원 목록
    """
    name = StringField(required=True)
    owner = ReferenceField('User')
    members = ListField(ReferenceField('User'))
    public = BooleanField(default=False)
    
    def __unicode__(self):
        return self.name
