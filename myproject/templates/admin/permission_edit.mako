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
        <a href="${request.route_url('admin_permission')}">권한관리</a> :  
        <span id="permission-name">${permission.name}</span> 
        <span id="permission-name-form" class="hidden">
            <input type="text" id="permission-name-input" name="permission-name-input" value="${permission.name}">
        </span>
    </h3>
    <a id="permission-ok" href="${request.route_url('admin_permission')}">확인</a>
    <a id="permission-member-add" href="${request.route_url('admin_permission_member_add', id=request.matchdict['id'])}">인원추가</a>
    <a id="permission-member-del" class="hidden" href="javascript:doDelete()">삭제</a>
    <a id="permission-name-save" class="hidden" href="javascript:doNameSave()">저장</a>
    <a id="permission-name-cancel" class="hidden" href="javascript:doNameCancel()">취소</a>
    <div id="description">
        <p>권한그룹 이름을 수정하려면 조직이름을 클릭하세요.</p>
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
            <th class="member-team-item"><div>부서</div></th>
            <th class="member-email-item"><div>이메일</div></th>
            <th class="member-mobile-item"><div>휴대폰</div></th>
            <th class="member-phone-item"><div>내선번호</div></th>
        </tr>

        % for member in members:
        <tr id="${member.username}" class="list-item">
            <td class="check-item">
                <div id="check-button" class=""></div>
            </td>
            <td class="member-name-item"><div>${member.name}</div></td>
            <td class="member-rank-item"><div>${member.get_rank()}</div></td>
            <td class="member-team-item"><div>${member.team}</div></td>
            <td class="member-email-item"><div>${member.email}</div></td>
            <td class="member-mobile-item"><div>${member.mobile}</div></td>
            <td class="member-phone-item"><div>${member.phone}</div></td>
        </tr>
        % endfor
    </tbody><!-- list -->
</table><!-- posts -->
</div>

<script>
function doDelete() {
    if (confirm("정말 삭제하시겠습니까?")) {
        var data = [];
        $(".list-item .checkmark").each(function() {
            data.push($(this).parents(".list-item").prop('id'))
        });
        var url = "${request.route_url('admin_permission_member_del', id=permission.id)}";
        $.post(url, {"id-list":data.join()}, function(data) {
            location.reload();
        }, "json");
    }
}
function toggleToolbar() {
    var checked = $(".list-item .checkmark").size(); 
    if (checked == 0) {
        $("#permission-member-del").hide();
        $("#permission-ok, #permission-member-add").show();
    }
    else {
        $("#permission-member-del").show();
        $("#permission-ok, #permission-member-add").hide();
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
    var url = "/admin/permission/${permission.id}/edit?sort=" + $(this).prop("id"); 
    
    if ($(this).prev().hasClass("sort-field")) {
        url += "&reverse=true";
    }
    $(location).attr("href", url);
}
function doSave(id, name) {
    var url = "/admin/permission/" + id + "/save";
    var data = {}
    
    data['name'] = name; 
    data['id'] = id;

    $.post(url, data, function() {
        location.reload();
    }, "json");
}
function doNameCancel() {
    $("#permission-name-form").hide();
    $("#permission-name-save,#permission-name-cancel").hide();
    $("#permission-ok, #permission-name").show();
    toggleToolbar();
}
function doNameSave() {
    doSave("${permission.id}", $("#permission-name-input").val()) 
}
function doEditName(e) {
    $(".list-head #check-button").removeClass("checkmark");
    $(".list-item #check-button").removeClass("checkmark");
    $(this).hide();
    $("#permission-ok, #permission-member-add, #permission-member-del").hide();
    $("#permission-name-save,#permission-name-cancel").show();
    $("#permission-name-form").show();
    $("#permission-name-input").focus();
}
$(document).ready(function() {
    $(".list-head .check-item").click(toggleCheckMarkAll);
    $(".list-item").click(toggleCheckMark);
    $("th a").click(toggleSort);
    $("#permission-name").click(doEditName);
    $("#permission-name-input").keydown(function(event) {
        if (event.which == 13) {
            doNameSave();
        }
        else if (event.which == 27) {
            doNameCancel();
        }
    });
});
</script>
