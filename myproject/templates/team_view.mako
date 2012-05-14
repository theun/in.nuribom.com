# -*- coding: utf-8 -*- 

<%inherit file="layout.mako"/>
<%
from myproject.views import log
from myproject.models import User
%>

<%def name="team_view(object, depth=0)">
    % if object.leader:
    <tr id="${object.leader.username}" class="list-item">
        <td class="active-item">
            <div id="active-button" class="team-leader"></div>
        </td>
        <td class="member-name-item"><div>${object.leader.name}</div></td>
        <td class="member-rank-item"><div>${object.leader.get_rank()}</div></td>
        <td class="member-team-item"><div>${object.get_path()}</div></td>
        <td class="member-email-item"><div>${object.leader.email}</div></td>
        <td class="member-mobile-item"><div>${object.leader.mobile}</div></td>
        <td class="member-phone-item"><div>${object.leader.phone}</div></td>
    </tr>
    % endif
    % for member in User.objects(team=object.name).order_by('name'):
    % if not object.leader or member.username != object.leader.username:
    <tr id="${member.username}" class="list-item">
        <td class="active-item">
            <div id="active-button" class="team-member"></div>
        </td>
        <td class="member-name-item"><div>${member.name}</div></td>
        <td class="member-rank-item"><div>${member.get_rank()}</div></td>
        <td class="member-team-item"><div>${object.get_path()}</div></td>
        <td class="member-email-item"><div>${member.email}</div></td>
        <td class="member-mobile-item"><div>${member.mobile}</div></td>
        <td class="member-phone-item"><div>${member.phone}</div></td>
    </tr>
    % endif
    % endfor
    % if object.children:
        % for child in object.children:
        ${team_view(child, depth+1)}
        % endfor
    % endif
</%def>

<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" rel="stylesheet" type="text/css"/>
<link rel="stylesheet" type="text/css" href="/static/stylesheets/admin.css">
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js"></script>

<div id="top-toolbar">
    <h3>
        <a href="${request.route_url('admin_team')}">조직도</a> : 
        % if team.parents:
            % for parent in team.parents:
            <span><a href="${request.route_url('admin_team_edit', id=parent.id)}">${parent.name}</a></span> >
            % endfor
        % endif
        <span id="team-name">${team.name}</span>
        <span id="team-name-form" class="disable">
            <input type="text" id="team-name-input" name="team-name-input" value="${team.name}">
        </span>
    </h3>
    <a id="team-ok" href="${request.route_url('team')}">확인</a>
    <div id="description" style="padding:0">
    </div>
</div>
<div id="content-body">
<table id="member-list" cellpadding="0" width="100%">
    <tbody class="lists">
        <tr class="list-head">
            <th class="active-item">
                <div id="active-button" class=""></div>
            </th>
            <th class="member-name-item"><div>이름</div></th>
            <th class="member-rank-item"><div>직위</div></th>
            <th class="member-team-item"><div>부서</div></th>
            <th class="member-email-item"><div>이메일</div></th>
            <th class="member-mobile-item"><div>휴대폰</div></th>
            <th class="member-phone-item"><div>내선번호</div></th>
        </tr>

        ${team_view(team)}
    </tbody>
</table>
</div>

<script>
function viewUser() {
    var url = "/account/" + $(this).prop("id") + "/info/basic"
    $(location).attr("href", url);
}
$(document).ready(function() {
    $(".list-item").click(viewUser);
});
</script>
