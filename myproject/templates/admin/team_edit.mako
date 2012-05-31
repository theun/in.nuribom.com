# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>
<%
from myproject.views import log

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
        <a href="${request.route_path('admin_team')}">조직관리</a> : 
        % if team.parents:
            % for parent in team.parents:
            <span><a href="${request.route_path('admin_team_edit', id=parent.id)}">${parent.name}</a></span> >
            % endfor
        % endif
        <span id="team-name">${team.name}</span>
        <span id="team-name-form" class="hidden">
            <input type="text" id="team-name-input" name="team-name-input" value="${team.name}">
        </span>
    </h3>
    <a id="team-ok" href="${request.route_path('admin_team')}">확인</a>
    <a id="team-member-add" href="${request.route_path('admin_team_member_add', id=request.matchdict['id'])}">인원추가</a>
    <a id="team-member-del" class="hidden" href="javascript:doDelete()">삭제</a>
    <a id="team-member-leader" class="hidden" href="javascript:doSetLeader()">팀장설정</a>
    <a id="team-name-save" class="hidden" href="javascript:doNameSave()">저장</a>
    <a id="team-name-cancel" class="hidden" href="javascript:doNameCancel()">취소</a>
    <div id="description">
        <p>조직이름을 수정하려면 조직이름을 클릭하세요.</p>
        <p>팀장은 <span class="team-leader" style="display: inline-block"></span>이 표시됩니다.</p>
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
    </tbody>
</table>
</div>

<script>
function doDelete() {
    if (confirm("정말 삭제하시겠습니까?")) {
        var data = [];
        $(".checkmark").each(function() {
            data.push($(this).parents(".list-item").prop('id'))
        });
        var url = "${request.route_path('admin_team_member_del', id=team.id)}";
        $.post(url, {"id-list":data.join()}, function(data) {
            location.reload();
        }, "json");
    }
}
function doSetLeader() {
    var url = "/admin/team/${team.id}/edit";
    var data = {"leader": $(".list-item .checkmark").parents(".list-item").attr("id")}
    $.post(url, data, function() {
        location.reload();
    }, "json");
}
function toggleToolbar() {
    var checked = $(".list-item .checkmark").size(); 
    if (checked == 0) {
        $("#team-member-del").hide();
        $("#team-ok, #team-member-add").show();
        $("#team-member-leader").hide();
    }
    else {
        if (checked == 1) $("#team-member-leader").show();
        $("#team-member-del").show();
        $("#team-ok, #team-member-add").hide();
    }
}
function toggleCheckMark(e) {
    if ($(this).find("#check-button").hasClass("checkmark")) {
        $(this).find("#check-button").removeClass("checkmark");
    }
    else {
        $(this).find("#check-button").addClass("checkmark");
    }
    toggleToolbar();
    
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
    toggleToolbar();
}
function toggleSort(e) {
    var reverse = false;
    var url = "/admin/team/${team.id}/edit?sort=" + $(this).prop("id"); 
    console.log('url');
    
    if ($(this).prev().hasClass("sort-field")) {
        url += "&reverse=true";
    }
    $(location).attr("href", url);
}
function doSave(id, name) {
    var url = "/admin/team/" + id + "/save";
    var data = {}
    
    data['name'] = name; 
    data['id'] = id;

    $.post(url, data, function() {
        location.reload();
    }, "json");
}
function doNameCancel() {
    $("#team-name-form").hide();
    $("#team-name-save,#team-name-cancel").hide();
    $("#team-ok, #team-name").show();
    toggleToolbar();
}
function doNameSave() {
    doSave("${team.id}", $("#team-name-input").val())
}
function doEditTeamName(e) {
    $(".list-head #check-button").removeClass("checkmark");
    $(".list-item #check-button").removeClass("checkmark");
    $(this).hide();
    $("#team-ok, #team-member-add, #team-member-leader, #team-member-del").hide();
    $("#team-name-save,#team-name-cancel").show();
    $("#team-name-form").show();
    $("#team-name-input").focus();
}
$(document).ready(function() {
    $(".list-head .check-item").click(toggleCheckMarkAll);
    $(".list-item").click(toggleCheckMark);
    $("th a").click(toggleSort);
    $("#team-name").click(doEditTeamName);
    $("#team-name-input").keydown(function(event) {
        if (event.which == 13) {
            doNameSave();
        }
        else if (event.which == 27) {
            doNameCancel();
        }
    });
});
</script>
