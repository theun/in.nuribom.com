# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako" />

<%
from myproject.views import log
from myproject.models import Team
%>

<%def name="team_row(object, id=None, depth=0)">
    <tr id="${id}" class="list-item">
        <td class="check-item">
            <div id="check-button"></div>
        </td>
        <td class="team-name-item">
            <div>
                % for d in range(depth):
                <span class="tree-node-icon"></span>
                % endfor
                <div class="tree-leaf-icon ${'tree-subitem-icon' if object.children else ''}"></div> 
                <span>${object.name}</span>
                <span style="color:darkblue;">
                (
                % if object.leader:
                ${object.leader.name} :
                % endif
                ${object.count()} 명
                )
                </span>
            </div>
        </td>
    </tr>
    % if object.children:
        % for t in object.children:
        ${team_row(t, t.id, depth+1)}
        % endfor
    % endif
</%def>

<link rel="stylesheet" href="/static/stylesheets/admin.css" media="screen" type="text/css" />

<div id="top-toolbar">
    <h3>조직관리</h3>
    <a id="team-add" href="javascript:doAdd()">팀추가</a>
    % if len(teams) > 1:
    <a id="team-move" class="hidden" href="#">
        <span>팀이동 &#9660;</span>
    </a>
    <div id="team-move-submenu" class="hidden">
        <li id=""><a href="javascript:doMoveTo('')">최상위로</a></li>
    % for t in teams:
        <li id="${t.id}"><a href="javascript:doMoveTo('${t.id}')">${t.name}</a></li> 
    % endfor
    </div>
    % endif
    <a id="team-edit" class="hidden" href="javascript:viewTeam()">편집</a>
    <a id="team-delete" class="hidden" href="javascript:doDelete()">삭제</a>
    <div id="description" style="padding:0">
    </div>
</div>

<div id="content-body">
<table id="team-list" cellpadding="0" width="100%">
    <tbody class="lists">
        % for team in teams:
            % if not team.parents:
            ${team_row(team, id=team.id, depth=0)}
            % endif
        % endfor
    </tbody><!-- list -->
</table><!-- posts -->
</div>
<script>
function viewTeam() {
    $(location).attr("href", "/admin/team/" + $(".checkmark").parents(".list-item").prop("id") + "/edit")
}
function toggleToolbar() {
    var checked = $(".list-item .checkmark").size(); 
    if (checked == 0) {
        $("#team-edit, #team-delete, #team-move").hide();
        $("#team-add").show();
    }    
    else {
        $("#team-delete, #team-move").show();
        if (checked == 1) {
            $("#team-add, #team-edit").show();
        } else {
            $("#team-add, #team-edit").hide();
        }
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
function doSave(id, name, parent) {
    var url = "/admin/team/" + id + "/save";
    var data = {}
    
    data['name'] = name; 
    data['id'] = id;

    if (parent) {
        url += "?parent=" + parent;
    }
    
    $.post(url, data, function(ret) {
        $(location).attr("href", "/admin/team");
    }, "json");
}
function doAdd() {
    var parent = null;
    
    if ($(".list-item .checkmark")) {
        parent = $(".list-item .checkmark").parents(".list-item").prop("id");
    }
    if (name = prompt("추가할 조직 이름을 입력하세요.")) {
        doSave("__new__", name, parent);
    }
}

function doDelete() {
    if (confirm("정말 삭제하시겠습니까?")) {
        var data = [];
        $(".list-item .checkmark").each(function() {
            data.push($(this).parents(".list-item").prop('id'))
        });
        $.post("/admin/team/del", {"id-list":data.join()}, function() {
            location.reload();
        });
    }
    else {
        $(".checkmark").removeClass("checkmark");
        toggleToolbar();
    }
}
function doMoveTeam(e) {
    e.stopPropagation();
    if ($("#team-move-submenu").is(":visible")) {
        $("#team-move-submenu").hide();
    } else {
        $("#team-move-submenu #" + $(".list-item .checkmark").eq(0).parents(".list-item").prop('id')).hide();
        $("#team-move-submenu").show();
        $("#team-move-submenu").offset({left: $("#team-move").offset().left});
    }
}
function doHideSubmenu(e) {
    if ($(e.target).parents("#team-move-submenu").length == 0) {
        if ($("#team-move-submenu").is(":visible")) {
            $("#team-move-submenu").hide();
        }
    }
}
function doMoveTo(targetParent) {
    doSave($(".list-item .checkmark").eq(0).parents(".list-item").prop('id'), '', targetParent);
}
$(document).ready(function() {
    $(".list-head .check-item").click(toggleCheckMarkAll);
    $(".list-item").click(toggleCheckMark);
    $("#team-move").click(doMoveTeam);
    $("html").click(doHideSubmenu);
});
</script>
