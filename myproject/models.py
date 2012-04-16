# -*- coding: utf-8 -*- 

import os
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

def groupfinder(userid, request):
    user = User.by_username(userid);
    groups = user and user.groups
    
    return groups or []

class Permission(Document):
    """
    시스템에 등록되는 그룹에 대한 Field를 정의한다.
    
     name        : 퍼미션 이름
      
    """
    name = StringField()
    
class Group(Document):
    """
    시스템에 등록되는 그룹에 대한 Field를 정의한다.
    
     name        : 그룹 이름
     permissions : 그룹에 대한 퍼미션 목록 
      
    """
    name = StringField(max_length=50)
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
    password = StringField(max_length=200)
    name = StringField(max_length=50)
    email = StringField(max_length=256)
    email1 = StringField(max_length=256)
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
    join_date = DateTimeField()
    leave_date = DateTimeField()
    job_summary = StringField()
    
    # 보안정보
    groups = ListField(StringField(max_length=50))
    permissions = ListField(StringField(max_length=50))
    
    def __unicode__(self):
        return self.name
    
    @classmethod
    def by_username(cls, username):
        return User.objects.filter(username=username).first()

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

    def validate_password(self, password):
        hashed_pass = sha1()
        hashed_pass.update(password + self.password[:40])
        return self.password[40:] == hashed_pass.hexdigest()

class Comment(EmbeddedDocument):
    
    """
    포스트된 글에 첨가되는 주석에 대한 EmbeddedField를 정의한다.
    
     id      : 주석에 대한 ID
     content : 주석 내용
     name    : 주석을 첨가한 사람. 일반적으로 로그인한 사람이 자동 추가된다.
     posted  : 주석이 추가된 시간.
      
    """
    content = StringField()
    name = StringField(max_length=120)
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
    comment = ListField(EmbeddedDocumentField(Comment))
    
    def __unicode__(self):
        return self.title
