# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>
<%
from myproject.views import log
from myproject.models import Permission

%>

<div class="navbar">
    <div class="navbar-inner">
        <a class="brand" href="/admin/account">계정관리</a>
        <ul class="nav">
            <li class="divider-vertical"></li>
            <li><a href="#">${user.name if user.name else u'추가'}</a></li>
        </ul>
    </div>
</div>

<div class="tabbable">
    <ul class="nav nav-tabs" id="admin-tab">
        <li class="active"><a href="#account-basic" data-toggle="tab">개인정보</a></li>
        % if request.matchdict['username'] != '__new__':
        <li><a href="#account-family" data-toggle="tab">가족정보</a></li>
        <li><a href="#account-school" data-toggle="tab">학력정보</a></li>
        <li><a href="#account-carrier" data-toggle="tab">경력정보</a></li>
        <li><a href="#account-perm" data-toggle="tab">권한정보</a></li>
        % endif
    </ul>

    <div class="tab-content">
        <div class="tab-pane active" id="account-basic">
            <%include file="account_basic.html" />
        </div>
        % if request.matchdict['username'] != '__new__':
        <div class="tab-pane" id="account-family">
            <%include file="../account/info_family.html" />
        </div>
        <div class="tab-pane" id="account-school">
            <%include file="../account/info_school.html" />
        </div>
        <div class="tab-pane" id="account-carrier">
            <%include file="../account/info_carrier.html" />
        </div>
        <div class="tab-pane" id="account-perm">
            <%include file="account_perm.html" />
        </div>
        % endif
    </div>
</div>

<style type="text/css">
    .tabbable { margin-top: 20px; }
    .table th { vertical-align: middle; }
    .tab-button { text-align: center; }
</style>

