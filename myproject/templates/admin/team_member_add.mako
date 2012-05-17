# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>
<%
from myproject.views import log
from datetime import datetime

sort = request.params['sort'] if 'sort' in request.params else ''
reverse = request.params['reverse'] if 'reverse' in request.params else ''

def sort_field(id):
    if id == sort:
        if reverse:
            return 'ui-icon ui-icon-triangle-1-s reverse-field'
        else:
            return 'ui-icon ui-icon-triangle-1-n sort-field'
    else:
        return 'ui-icon ui-icon-grip-dotted-vertical normal-field'
%>

<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" rel="stylesheet" type="text/css"/>
<link rel="stylesheet" type="text/css" href="/static/stylesheets/admin.css">
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js"></script>

<div id="top-toolbar">
    <h3>
        <a href="${request.route_path('admin_team')}">그룹관리</a> : 
        <a href="${request.route_path('admin_team_edit', id=team.id)}">${team.name}</a> > 
        인원 추가
    </h3>
    <a href="javascript:doAdd()">확인</a>
    % if team.count() > 0:
    <a href="javascript:doDelete()">삭제</a>
    % endif

    <div id="description">
    <p>추가할 인원을 선택하고 확인을 누르세요</p>
    </div>
</div>
<div id="content-body">
<table id="member-list" cellpadding="0" width="100%">
    <tbody class="lists">
        <tr class="list-head">
            <th class="check-item">
                <div id="check-button" class=""></div>
            </th>
            <th class="member-name-item">
                <div>
                    <span class="${sort_field('name')}"></span>
                    <a href="#" id="name">이름</a>
                </div>
            </th>
            <th class="member-rank-item">
                <div>
                    <span class="${sort_field('rank')}"></span>
                    <a href="#" id="rank">직위</a>
                </div>
            </th>
            <th class="member-team-item">
                <div>
                    <span class="${sort_field('team')}"></span>
                    <a href="#" id="team">부서</a>
                </div>
            </th>
            <th class="member-email-item"><div>이메일</div></th>
            <th class="member-mobile-item"><div>휴대폰</div></th>
            <th class="member-phone-item"><div>내선번호</div></th>
        </tr>

        % for user in users:
        <tr id="${user.username}" class="list-item">
            <td class="check-item">
                <div id="check-button" class=""></div>
            </td>
            <td class="member-name-item"><div>${user.name}</div></td>
            <td class="member-rank-item"><div>${user.get_rank()}</div></td>
            <td class="member-team-item"><div>${user.team}</div></td>
            <td class="member-email-item"><div>${user.email}</div></td>
            <td class="member-mobile-item"><div>${user.mobile}</div></td>
            <td class="member-phone-item"><div>${user.phone}</div></td>
        </tr>
        % endfor
    </tbody><!-- list -->
</table><!-- posts -->
</div>

<script>
function doAdd() {
    var data = [];
    $(".list-item .checkmark").each(function() {
        data.push($(this).parents(".list-item").prop('id'))
    });
    var url = "${request.route_path('admin_team_member_add', id=team.id)}";
    $.post(url, {"id-list":data.join()}, function() {
        $(location).attr("href", "${request.route_path('admin_team_edit', id=team.id)}");
    }, "json");
}
function toggleCheckMark(e) {
    if ($(this).find("#check-button").hasClass("checkmark")) {
        $(this).find("#check-button").removeClass("checkmark");
    }
    else {
        $(this).find("#check-button").addClass("checkmark");
    }
    
    return false;
}
function toggleCheckMarkAll(e) {
    if ($(this).find("#check-button").hasClass("checkmark")) {
        $(".list-head #check-button").removeClass("checkmark");
        $(".list-item #check-button").removeClass("checkmark");
    }
    else {
        $(".list-head #check-button").addClass("checkmark");
        $(".list-item #check-button").addClass("checkmark");
    }
}
function toggleSort(e) {
    var reverse = false;
    var url = "/admin/team/${team.id}/member_add?sort=" + $(this).prop("id"); 
    console.log('url');
    
    if ($(this).prev().hasClass("sort-field")) {
        url += "&reverse=true";
    }
    $(location).attr("href", url);
}
$(document).ready(function() {
    $(".list-head .check-item").click(toggleCheckMarkAll);
    $(".list-item").click(toggleCheckMark);
    $("th a").click(toggleSort);
});
</script>
