# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>

<%
from myproject.views import log
from myproject.models import User
%>

<link rel="stylesheet" type="text/css" href="/static/stylesheets/admin.css">

<div id="top-toolbar">
    <h3>권한그룹관리</h3>
    <a id="group-delete" class="disable" href="javascript:doDelete()">삭제</a>
    <a id="group-edit" class="disable" href="javascript:viewGroup()">편집</a>
    <a id="group-add" href="javascript:doAdd()">추가</a>
    <div id="description">
    <p>권한은 카테고리와 수행 권한으로 분류하여 "카테고리:수행권한"이 하나의 권한으로 동작하며, 하나의 권한그룹은 여러개의 권한을 갖을 수 있습니다.</p>
    <p>카테고리: blog, account, admin</p>
    <p>수행권한: *, delete, view, edit</p>
    </div>
</div>

<div id="content-body">
<table id="post-list" cellpadding="0" width="100%">
    <tbody class="lists">
        <tr class="list-head">
            <th class="check-item"><div id="check-button" class=""></div></th>
            <th class="group-name-item"><div>권한그룹</div></th>
            <th class="group-permission-item"><div>권한</div></th>
            <th class="group-members-item"><div>인원수</div></th>
        </tr>

        % for group in groups:
        <tr id="${group.id}" class="list-item">
            <td class="check-item">
                <div id="check-button" class=""></div>
            </td>
            <td class="group-name-item"><div>${group.name.split(':')[1]}</div></td>
            <td class="group-permission-item"><div>
            % for perm in group.permissions:
                ${perm}${', ' if not loop.last else ''}
            % endfor
            </div></td>
            <td class="group-members-item"><div>${len(User.objects(groups=group.name))}명</div></td>
        </tr>
        % endfor
    </tbody><!-- list -->
</table><!-- posts -->
</div>

<script>
function viewGroup() {
    $(location).attr("href", "/admin/group/" + $(".checkmark").parents(".list-item").prop("id") + "/edit")
}
function doDelete() {
    if (confirm("정말 삭제하시겠습니까?")) {
        var data = [];
        $(".list-item .checkmark").each(function() {
            data.push($(this).parents(".list-item").prop('id'))
        });
        var url = "${request.route_path('admin_group_del')}";
        $.post(url, {"id-list":data.join()}, function() {
            location.reload();
        }, "json");
    } else {
        $(".checkmark").removeClass("checkmark");
        toggleToolbar();
    }
}
function doSave(id, name) {
    var url = "/admin/group/" + id + "/save";
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
        $("#group-delete").hide();
        $("#group-add").show();
    }
    else {
        $("#group-delete").show();
        $("#group-add").hide();
    }
    if ($(".list-item .checkmark").size() == 1) {
        $("#group-edit").show();
    } else {
        $("#group-edit").hide();
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
