# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>
<%
from myproject.views import log
from pyramid.security import authenticated_userid
from collections import OrderedDict

category = request.matchdict.get('category', 'basic')

if authenticated_userid(request) == user.username:
    category_info = OrderedDict([
        ('basic', (u'개인정보', 'info_basic.html')),
        ('family', (u'가족정보', 'info_family.html')),
        ('school', (u'학력정보', 'info_school.html')),
        ('carrier', (u'경력정보', 'info_carrier.html')),
        ('salary', (u'연봉정보', 'info_salary.html')),
        ('notification', (u'알림설정', 'info_notification.html'))
    ])
else:
    category_info = OrderedDict([('basic', (u'개인정보', 'info_basic.html'))])

%>

<div class="tabbable">
    <ul class="nav nav-tabs">
        % for c in category_info:
        <li class="${'active' if c == category else ''}">
            <a href="#${c}" data-toggle="tab" name="${c}">${category_info[c][0]}</a>
        </li>
        % endfor
    </ul>

    <div class="tab-content">
        % for c in category_info:
        <div class="tab-pane ${'active' if c == category else ''}" id="${c}">
            <%include file="${category_info[c][1]}" />
        </div>
        % endfor
    </div>
</div>

% if error_message:
    <div class="error-message">
        <span>오류: ${error_message}</span>
    </div>
% endif

<style type="text/css">
    .tabbable { margin-top: 20px; }
    .table th { vertical-align: middle; }
    .tab-button { text-align: center; }
</style>
