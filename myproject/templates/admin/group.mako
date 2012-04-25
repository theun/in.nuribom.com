# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako" />

<%
from myproject.views import log
from myproject.models import Team
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

<%def name="team_row(object, id=None, is_last=False)">
    <tr id="${id}" class="list-item ${'disable' if is_last else ''}">
        <td class="check-item">
            <div id="check-button" class="${'disable' if id=='__new__' else ''}"></div>
        </td>
        <td class="team-name-item"><div>${object['name']}</div></td>
        <td class="team-leader-item"><div>${object['leader'].name if object['leader'] else ''}</div></td>
        <td class="team-count-item"><div>
            ${u'%d 명' % (object.count() if isinstance(object, Team) else 0)}
        </div></td>
    </tr>
</%def>

<link rel="stylesheet" href="/static/stylesheets/admin.css" media="screen" type="text/css" />

<div id="top-toolbar">
    <h3>그룹 관리</h3>
    % if len(teams) > 0:
    <a href="javascript:doDelete()">삭제</a>
    <a href="javascript:doEdit()">편집</a>
    <a href="javascript:doAdd()">추가</a>
    <a class="disable" href="javascript:doSave()">저장</a>
    % endif
    <div id="description" style="padding:0">
    </div>
</div>

<table id="team-list" cellpadding="0" width="100%">
    <tbody class="lists">
        <tr class="list-head">
            <th class="check-item">
                <div id="check-button" class=""></div>
            </th>
            <th class="team-name-item">
                <div>이름</div>
            </th>
            <th class="team-leader-item">
                <div>팀장</div>
            </th>
            <th class="team-count-item">
                <div>인원</div>
            </th>
        </tr>

        % for team in teams:
        ${team_row(team, id=team.id)}
        % endfor
        ${team_row({'name': '', 'leader': ''}, id='__new__', is_last=True)}
    </tbody><!-- list -->
</table><!-- posts -->

<script>
function viewTeam(e) {
    if ($(this).parent().prop("id") == '__new__')
        return false;
        
    $(location).attr("href", "/admin/group/" + $(this).parent().prop("id") + "/edit")
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
function ignoreClick(e) {
    return false;
}

var editId = null;

inputHTML='\
    <tr  id="info-row-input" class="info-row disable list-item">\
        <td class="check-item">\
        </td>\
        <td class="team-name-item">\
            <div>\
                <input id="info-name-input" value="{0}" class="input_text email">\
            </div>\
        </td>\
        <td class="team-leader-item"><div></div></td>\
        <td class="team-count-item"><div></div></td>\
    </tr>\
';

function showForm(id, data) {
    $("#" + id).after(inputHTML.format(data, id));
    $("#info-row-input").fadeIn();
    $("#info-name-input").focus();
}

function doAdd() {
    editId = "__new__"
    $("#top-toolbar a").toggleClass("disable");
    $("#" + editId).fadeOut(function() { showForm(editId, $("#" + editId + " .team-name-item div").html()); });
    $(".lists .list-item .team-name-item").click(null);
}

function doEdit() {
    if (editId != null) 
        $("#" + editId).show();

    if ($(".checkmark").size() != 1) {
        alert("편집할 그룹을 하나만 선택해주세요");
        return false;
    }
    editId = $(".checkmark").parents(".list-item").prop('id');
    $("#" + editId).fadeOut(function() { showForm(editId, $("#" + editId + " .team-name-item div").html()); });
    $(".lists .list-item .team-name-item").click(null);
}

function doDelete() {
    if (confirm("정말 삭제하시겠습니까?")) {
        $(".checkmark").each(function() {
            id = $(this).parents(".list-item").prop('id')
            var url = "/admin/group/" + id + "/del";
            var delId = "#" + id; 
            $.post(url, function(data) {
                $(delId).fadeOut(function(){ $(delId).remove(); });
            }, "json");
        });
    }
}

function doSave() {
    if (!$('#info-name-input').val().trim()) {
        alert("이름을 입력하세요!");
        $("#info-name-input").focus();
        return false;
    }
    
    var url = "/admin/group/" + editId + "/save";
    var data = {}
    var saveId = "#" + editId
    
    data['name'] = $('#info-name-input').val(); 
    data['id'] = editId;

    $.post(url, data, function(data) {
        if ('__new__' == editId) {
            var add_row = $("#info-row-input").prev().prop('outerHTML').replace(/__new__/g, data['id']);
            $(saveId).before(add_row);
            $('#' + data['id'] + ' .team-name-item div').html(data['name']);
            $('#' + data['id'] + ' .team-count-item div').html('0 명');
            $('#' + data['id'] + ' .disable').removeClass('disable');
            $('#' + data['id']).fadeIn();
            $(".list-item .check-item").click(toggleCheckMark);
        }
        doCancel();
        
        if ('message' in data) {
            $("#message").html(data.message);
            $('#dialog').dialog('open');
        }
    }, "json");
}

function doCancel() {
    $("#info-row-input").fadeOut(function() {
        if (editId == '__new__') { 
            $("#top-toolbar a").toggleClass("disable");
        }
        else {
            $(".checkmark").removeClass("checkmark");
            $(this).prev().fadeIn();
        }
        $(this).remove();
        editId = null
    });
    $(".lists .list-item .team-name-item").click(viewTeam);
}
$(document).ready(function() {
    $(".lists .list-item .team-name-item").click(viewTeam);
    $(".list-head .check-item").click(toggleCheckMarkAll);
    $(".list-item .check-item").click(toggleCheckMark);

    $(document).keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
        }
        if (event.which == 27) {
            doCancel();
        }
    }); 
});
</script>
