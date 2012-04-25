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
        <a href="${request.route_url('admin_group')}">그룹관리</a> : 
        <a href="${request.route_url('admin_group_edit', id=team.id)}">${team.name}</a> 
    </h3>
    <a href="${request.route_url('admin_group_member_add', id=request.matchdict['id'])}">인원추가</a>
    % if team.count() > 0:
    <a href="javascript:doDelete()">삭제</a>
    % endif
    <div id="description">
        <p>팀장을 설정하시려면 <span class="team-member" style="display: inline-block"></span>을 클릭하세요.
        팀장은 <span class="team-leader" style="display: inline-block"></span>가 표시됩니다.
    </div>
</div>
<div id="content-body">
<table id="member-list" cellpadding="0" width="100%">
    <tbody class="lists">
        <tr class="list-head">
            <th class="check-item">
                <div id="check-button" class=""></div>
            </th>
            <th class="active-item">
                <div id="active-button" class=""></div>
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
            <th class="member-team-item"><div>부서</div></th>
            <th class="member-email-item"><div>이메일</div></th>
            <th class="member-mobile-item"><div>휴대폰</div></th>
            <th class="member-phone-item"><div>내선번호</div></th>
        </tr>

        % if team.leader:
        <tr id="${team.leader.username}" class="list-item">
            <td class="check-item">
                <div id="check-button" class=""></div>
            </td>
            <td class="active-item">
                <div id="active-button" class="team-leader"></div>
            </td>
            <td class="member-name-item"><div>${team.leader.name}</div></td>
            <td class="member-rank-item"><div>${team.leader.get_rank()}</div></td>
            <td class="member-team-item"><div>${team.leader.team}</div></td>
            <td class="member-email-item"><div>${team.leader.email}</div></td>
            <td class="member-mobile-item"><div>${team.leader.mobile}</div></td>
            <td class="member-phone-item"><div>${team.leader.phone}</div></td>
        </tr>
        % endif
        % for member in members:
        % if not team.leader or member.username != team.leader.username:
        <tr id="${member.username}" class="list-item">
            <td class="check-item">
                <div id="check-button" class=""></div>
            </td>
            <td class="active-item">
                <div id="active-button" class="team-member"></div>
            </td>
            <td class="member-name-item"><div>${member.name}</div></td>
            <td class="member-rank-item"><div>${member.get_rank()}</div></td>
            <td class="member-team-item"><div>${member.team}</div></td>
            <td class="member-email-item"><div>${member.email}</div></td>
            <td class="member-mobile-item"><div>${member.mobile}</div></td>
            <td class="member-phone-item"><div>${member.phone}</div></td>
        </tr>
        % endif
        % endfor
    </tbody><!-- list -->
</table><!-- posts -->
</div>

<script>
function doDelete() {
    input_data = {}
    $(".checkmark").parents(".list-item").each(function(index) {
        id = $(this).prop('id');
        input_data[id] = index;
    });
    var url = "${request.route_url('admin_group_member_del', id=team.id)}";
    $.post(url, input_data, function(data) {
        $(location).attr("href", "${request.route_url('admin_group_edit', id=team.id)}");
    }, "json");
}
function doSetLeader() {
    var url = "/admin/group/${team.id}/edit";
    var data = {"leader": $(this).parents(".list-item").attr("id")}
    $.post(url, data, function() {
        $(location).attr("href", $(location).attr("href"));
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
    var url = "/admin/group/${team.id}/edit?sort=" + $(this).prop("id"); 
    console.log('url');
    
    if ($(this).prev().hasClass("sort-field")) {
        url += "&reverse=true";
    }
    $(location).attr("href", url);
}
$(document).ready(function() {
    $(".list-head .check-item").click(toggleCheckMarkAll);
    $(".list-item .check-item").click(toggleCheckMark);
    $(".list-item .active-item").click(doSetLeader);
    $("th a").click(toggleSort);
});
</script>
