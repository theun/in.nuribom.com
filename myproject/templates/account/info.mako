# -*- coding: utf-8 -*- 

<%inherit file="layout.mako"/>
<%
from myproject.views import log
from pyramid.security import authenticated_userid
from collections import OrderedDict

category = request.matchdict['category']
category_info = OrderedDict([
    ('basic', (u'개인정보', 'info_basic.html')),
    ('family', (u'가족정보', 'info_family.html')),
    ('school', (u'학력정보', 'info_school.html')),
    ('carrier', (u'경력정보', 'info_carrier.html')),
    ('salary', (u'연봉정보', 'info_salary.html')),
    ('notification', (u'알림설정', 'info_notification.html'))
])
%>

<link rel="stylesheet" href="/static/stylesheets/info.css" media="screen" type="text/css" />

<div id="top-toolbar">
    <h3>${category_info[category][0]}</h3>

    % if authenticated_userid(request) == user.username and category != 'notification':
    <a id="account-edit" href="javascript:doEditInfo()" title="${category_info[category][0]}를 수정합니다"
        class="${'hidden' if mode == 'edit' else ''}">수정</a>
    <a id="account-save" href="javascript:doSaveInfo()" title="${category_info[category][0]}를 저장합니다" 
        class="${'hidden' if mode != 'edit' else ''}">저장</a>
    <script>
        function doEditInfo() {
            location.href += "?mode=edit";
        }
        
        function doSaveInfo() {
            $("#account_form").submit();
        }
    </script>
    % endif
    <div id="description">
    </div>
</div>

<div id="content-body">
	<%include file="${category_info[category][1]}" />
% if error_message:
    <div class="error-message">
        <span>오류: ${error_message}</span>
    </div>
% endif
</div>
