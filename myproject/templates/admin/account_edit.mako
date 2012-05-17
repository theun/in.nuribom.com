# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>
<%
from myproject.views import log
from myproject.models import Permission
from datetime import datetime

tab_select = request.params['tab'] if 'tab' in request.params else None
%>

<link rel="stylesheet" type="text/css" href="/static/stylesheets/admin.css">

<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" rel="stylesheet" type="text/css"/>
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js"></script>

<div id="top-toolbar">
    <h3><a href="/admin/account">계정관리</a> : ${user.name if user.name else u'추가'}</h3>
    <a id="perm-edit" href="#">
        <span>권한편집</span>
        <div class="has-sub-menu"> </div>
    </a>
    <div id="perm-submenu" class="hidden">
    % for perm in Permission.objects:
        <li id="${perm.id}"><input type="checkbox" ${'checked' if perm.name in user.permissions else ''} name="${perm.id}" value="${perm.name}">${perm.name}</li>
    % endfor
        <li id="perm-add" align="center"><a href="javascript:doSavePerm()">확인</a></li>
    </div>
    <div id="description">
        편집을 취소하시려면 편집 중에 ESC키를 누르세요.
    </div>
</div>

<div id="content-body">
    <div id="tabs">
        <ul>
        <% 
            categories = ['basic', 'family', 'school', 'carrier']
            category_names = [u'기본정보', u'가족정보', u'학력정보', u'경력정보']
        %>
        % for i in range(len(categories)):
            <li><a href="#fragment-${i+1}"><span>${category_names[i]}</span></a></li>
        % endfor
        </ul>
        <div id="fragment-1">
        <%include file="account_basic.html" />
        </div>
        <div id="fragment-2">
        <%include file="account_family.html" />
        </div>
        <div id="fragment-3">
        <%include file="account_school.html" />
        </div>
        <div id="fragment-4">
        <%include file="account_carrier.html" />
        </div>
    </div>
</div>

<script>
var editId = null;
var showForm = {
    'family': showFamilyForm,
    'school': showSchoolForm,
    'carrier': showCarrierForm
};

function doEdit(category, id, class_name) {
    console.log(editId);
    if (editId != null) 
        $(editId).show();
        
    editId = "#info-row-" + category + '-' + id;
    $("#info-row-input").remove();

    // '/account/{username}/info/{category}/get'
    var url = "/account/${user.username}/info/" + category + "/get?id=" + id;
    $.get(url, function(data) {
        $(editId).fadeOut(function() { showForm[category](id, data, class_name); });
    }, "json");
}

function doDelete(category, id) {
    if (confirm("정말 삭제하시겠습니까?")) {
        // '/account/{username}/info/{category}/save'
        var url = "/account/${user.username}/info/" + category + "/save?id=" + id + "&action=delete";
        var delId = "#info-row-" + category + '-' + id; 
        $.post(url, function(data) {
            $(delId).fadeOut(function(){ $(delId).remove(); });
            $(location).attr('href', '/admin/account/edit/${user.username}?tab=' + $("#tabs").tabs('option', 'selected'))
        }, "json");
    }
}

function doSave(category, id, fields) {
    var url = "/account/${user.username}/info/" + category + "/save?id=" + id;
    var data = {}
    var saveId = "#info-row-" + category + '-' + id
    
    $.each(fields, function(index, value) {
        data[value] = $('#info-' + value + '-' + category + '-input').val(); 
    });
    data['id'] = id;
    $.post(url, data, function(data) {
        var tableId = ".table_" + category;
        var info_id = $(tableId).children().eq(-2).attr('id')
        var last_id = info_id.substr(info_id.lastIndexOf('-')+1, info_id.length-1)
        if (parseInt(last_id) == id) {
            var pattern = new RegExp(last_id, 'g')
            var add_row = $(tableId).children().eq(-2).prop('outerHTML')
            $(tableId + " a").eq(-2).removeClass("disable")
            $("#info-row-input").before(add_row.replace(pattern, parseInt(last_id)+1))
            $(saveId).fadeIn();
        }
        doCancel();
        
        if ('message' in data) {
            $("#message").html(data.message);
            $('#dialog').dialog('open');
        }
        
        if ('id' in data) {
            $.each(fields, function(index, value){
                value_field = '#info-' + value + '-' + category;
                if (id.constructor == Number)
                    value_field += '-' + id;
                $(value_field).html(data[value] ? data[value] : '&nbsp');
            });
        }
    }, "json");
}

function doCancel() {
    $("#info-row-input").fadeOut(function() {
        $(this).prev().fadeIn();
        $(this).remove();
        editId = null
    });
}

function doEditPerm(e) {
    e.stopPropagation();
    if ($("#perm-submenu").is(":visible")) {
        $("#perm-submenu").hide();
    } else {
        $("#perm-submenu").css("left", $("#perm-edit").offset().left-10);
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
function doSavePerm() {
    var perms = [];
    $("input:checked").each(function(index, value) {
        perms.push($(this).val());
    });
    
    if (perms) {
        var url = "${request.route_path('admin_account_edit', username=user.username)}";
        
        $.post(url, {"perms": perms.join()}, function() {
            location.reload();
        }, "json");
    }
}
$(document).ready(function() {
    // Dialog           
    $('#dialog').dialog({
        autoOpen: false,
        width: 600,
        buttons: {
            "확인": function() { 
                $(this).dialog("close"); 
            }, 
        }
    });
    $('#dialog_link, ul#icons li').hover(
        function() { $(this).addClass('ui-state-hover'); }, 
        function() { $(this).removeClass('ui-state-hover'); }
    );
    $(document).keydown(function(event) {
        if (event.which == 13) {
            event.preventDefault();
        }
        if (event.which == 27) {
            doCancel();
        }
    }); 
    $(function () {
        $('#fileupload').fileupload({
            dataType: 'json',
            done: function (e, data) {
                $.each(data.result, function (index, file) {
                    $(location).attr('href', $(location).attr('href'))
                });
            }
        });
    });
    $("#tabs").tabs(${'{disabled: [1, 2, 3]}' if request.matchdict['username'] == '__new__' else ''});
    $("#tabs").tabs("select", ${tab_select if tab_select else 0}); 
    $("#perm-edit").click(doEditPerm);
    $("html").click(doHideSubmenu);
});
</script>
