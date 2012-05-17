# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>

<%
from myproject.views import log
from myproject.models import User
%>

<link rel="stylesheet" type="text/css" href="/static/stylesheets/admin.css">

<div id="top-toolbar">
    <h3>권한관리</h3>
    <a id="permission-delete" class="disable" href="javascript:doDelete()">삭제</a>
    <a id="permission-edit" class="disable" href="javascript:viewPermission()">편집</a>
    <a id="permission-add" href="javascript:doAdd()">추가</a>
    <div id="description">
    </div>
</div>

<div id="content-body">
<table id="post-list" cellpadding="0" width="100%">
    <tbody class="lists">
        <tr class="list-head">
            <th class="check-item"><div id="check-button" class=""></div></th>
            <th class="permission-name-item"><div>권한이름</div></th>
            <th class="permission-members-item"><div>인원수</div></th>
        </tr>

        % for perm in permissions:
        <tr id="${perm.id}" class="list-item">
            <td class="check-item">
                <div id="check-button" class=""></div>
            </td>
            <td class="permission-name-item"><div>${perm.name}</div></td>
            <td class="permission-members-item"><div>${len(User.objects(permissions=perm.name))}명</div></td>
        </tr>
        % endfor
    </tbody><!-- list -->
</table><!-- posts -->
</div>

<script>
function viewPermission() {
    $(location).attr("href", "/admin/permission/" + $(".checkmark").parents(".list-item").prop("id") + "/edit")
}
function doDelete() {
    if (confirm("정말 삭제하시겠습니까?")) {
        var data = [];
        $(".list-item .checkmark").each(function() {
            data.push($(this).parents(".list-item").prop('id'))
        });
        var url = "${request.route_path('admin_permission_del')}";
        $.post(url, {"id-list":data.join()}, function() {
            location.reload();
        }, "json");
    } else {
        $(".checkmark").removeClass("checkmark");
        toggleToolbar();
    }
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
function doAdd() {
    if (name = prompt("추가할 그룹이름을 입력하세요.")) {
        doSave("__new__", name);
    }
}
function toggleToolbar() {
    if ($(".list-item .checkmark").size() == 0) {
        $("#permission-delete").hide();
        $("#permission-add").show();
    }
    else {
        $("#permission-delete").show();
        $("#permission-add").hide();
    }
    if ($(".list-item .checkmark").size() == 1) {
        $("#permission-edit").show();
    } else {
        $("#permission-edit").hide();
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
$(document).ready(function() {
    $(".list-head .check-item").click(toggleCheckMarkAll);
    $(".list-item").click(toggleCheckMark);
});
</script>
