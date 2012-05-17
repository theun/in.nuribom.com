# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>
<%
from myproject.views import log
from myproject.models import Permission
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
        <a href="${request.route_path('admin_group')}">권한그룹관리</a> :  
        <span id="group-name">${group.name.split(':')[1]}</span> 
        <span id="group-name-form" class="hidden">
            <input type="text" id="group-name-input" name="group-name-input" value="${group.name.split(':')[1]}">
        </span>
    </h3>
    <a id="group-ok" href="${request.route_path('admin_group')}">확인</a>
    <a id="group-member-add" href="${request.route_path('admin_group_member_add', id=request.matchdict['id'])}">인원추가</a>
    <a id="group-member-del" class="hidden" href="javascript:doDelete()">삭제</a>
    <a id="group-name-save" class="hidden" href="javascript:doNameSave()">저장</a>
    <a id="group-name-cancel" class="hidden" href="javascript:doNameCancel()">취소</a>
    <a id="group-perm-edit" href="#">
        <span>권한편집</span>
        <div class="has-sub-menu"> </div>
    </a>
    <div id="perm-submenu" class="hidden">
    % for perm in Permission.objects:
        <li id="${perm.id}"><input type="checkbox" ${'checked' if perm.name in group.permissions else ''} name="${perm.id}" value="${perm.name}">${perm.name}</li>
    % endfor
        <li id="perm-add" align="center"><a href="javascript:doAddPermExecute()">확인</a></li>
    </div>
    <div id="description">
        <p>권한그룹 이름을 수정하려면 조직이름을 클릭하세요.</p>
        <p>소유권한 : 
        % for perm in group.permissions:
            ${perm}${',' if not loop.last else ''}
        % endfor
        </p>
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
        var url = "${request.route_path('admin_group_member_del', id=group.id)}";
        $.post(url, {"id-list":data.join()}, function(data) {
            location.reload();
        }, "json");
    }
}
function toggleToolbar() {
    var checked = $(".list-item .checkmark").size(); 
    if (checked == 0) {
        $("#group-member-del").hide();
        $("#group-ok, #group-member-add, #group-perm-edit").show();
    }
    else {
        $("#group-member-del").show();
        $("#group-ok, #group-member-add, #group-perm-edit").hide();
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
    var url = "/admin/group/${group.id}/edit?sort=" + $(this).prop("id"); 
    
    if ($(this).prev().hasClass("sort-field")) {
        url += "&reverse=true";
    }
    $(location).attr("href", url);
}
function doSave(id, name, perms) {
    var url = "/admin/group/" + id + "/save";
    var data = {}
    
    data['name'] = name;
    data['id'] = id;
    data['perms'] = perms

    $.post(url, data, function() {
        location.reload();
    }, "json");
}
function doNameCancel() {
    $("#group-name-form").hide();
    $("#group-name-save,#group-name-cancel").hide();
    $("#group-ok, #group-name").show();
    toggleToolbar();
}
function doNameSave() {
    doSave("${group.id}", $("#group-name-input").val()) 
}
function doEditGroupName(e) {
    $(".list-head #check-button").removeClass("checkmark");
    $(".list-item #check-button").removeClass("checkmark");
    $(this).hide();
    $("#group-ok, #group-member-add, #group-member-del, #group-perm-edit").hide();
    $("#group-name-save,#group-name-cancel").show();
    $("#group-name-form").show();
    $("#group-name-input").focus();
}
function doAddPerm(e) {
    e.stopPropagation();
    if ($("#perm-submenu").is(":visible")) {
        $("#perm-submenu").hide();
    } else {
        $("#perm-submenu").css("left", $("#group-perm-edit").offset().left);
        $("#perm-submenu #" + $(".list-item .checkmark").eq(0).parents(".list-item").prop('id')).hide();
        $("#perm-submenu").show();
    }
}
function doHideSubmenu(e) {
    if ($(e.target).parents("#perm-submenu").length == 0) {
        if ($("#perm-submenu").is(":visible")) {
            $("#perm-submenu").hide();
        }
    }
}
function doAddPermExecute() {
    var perms = [];
    $(":checked").each(function(index, value) {
        perms.push($(this).val());
    });
    
    if (perms) {
        doSave("${group.id}", "${group.name.split(':')[1]}", perms.join());
    }
}
$(document).ready(function() {
    $(".list-head .check-item").click(toggleCheckMarkAll);
    $(".list-item").click(toggleCheckMark);
    $("th a").click(toggleSort);
    $("#group-name").click(doEditGroupName);
    $("#group-name-input").keydown(function(event) {
        if (event.which == 13) {
            doNameSave();
        }
        else if (event.which == 27) {
            doNameCancel();
        }
    });
    $("#group-perm-edit").click(doAddPerm);
    $("html").click(doHideSubmenu);
});
</script>
