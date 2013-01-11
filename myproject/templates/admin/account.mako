# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako" />

<%
from myproject.views import log
from pyramid.security import authenticated_userid
from myproject.models import User
from mongoengine import Q

sort = request.params['sort'] if 'sort' in request.params else ''
reverse = request.params['reverse'] if 'reverse' in request.params else ''

login = User.by_username(authenticated_userid(request))

def sort_field(id):
    if id == sort:
        if reverse:
            return 'icon-arrow-up reverse-field'
        else:
            return 'icon-arrow-down sort-field'
    else:
        return 'normal-field'

def get_active_account():
    return len(User.objects(Q(leave_date='') & Q(join_date__ne='') & Q(activate='') & Q(password__ne='')))

def get_work_account():
    return len(User.objects(Q(leave_date='') & Q(join_date__ne='')))

def get_leave_account():
    return len(User.objects(leave_date__ne=''))

%>

<div class="navbar">
    <div class="navbar-inner">
        <a class="brand" href="#">계정관리</a>
        <ul class="nav">
            <li class="divider-vertical"></li>
            <li><a href="#">${len(users)} 명</a></li>
            <li class="account-menu active-selected"><a id="account-activate" href="javascript:doActivateUser()">계정활성화</a></li>
            % if login and 'group:admin' in login.groups:
            <li class="account-menu active-selected"><a id="account-deactivate" href="javascript:doDeactivateUser()">계정비활성화</a></li>
            <li class="account-menu active-selected"><a id="account-delete" href="javascript:doDelete()">삭제</a></li>
            % endif
            <li class="account-menu"><a id="account-add" href="${request.route_path('admin_account_edit', username='__new__')}">추가</a></li>
        </ul>
    </div>
</div>
<div id="description">
<p>활성계정: ${get_active_account()}명, 재직중: ${get_work_account()}명, 퇴직 : ${get_leave_account()}명</p>
</div>

<div class="table-wrap">
    <table class="table table-striped table-bordered" id="employee-list">
        <thead>
            <tr class="success">
                <th><input class="check-item" type="checkbox"></th>
                <th><div class=""></div></th>
                <th class="span1"><a href="#" id="employee_id">
                    사번<i class="${sort_field('employee_id')}"></i>
                </a></th>
                <th class="span2"><a href="#" id="name">
                    이름<i class="${sort_field('name')}"></i>
                </a></th>
                <th class="span2"><a href="#" id="rank">
                    직위<i class="${sort_field('rank')}"></i>
                </a></th>
                <th class="span2"><a href="#" id="grade">
                    직급<i class="${sort_field('grade')}"></i>
                </a></th>
                <th class="span2"><a href="#" id="team">
                    소속<i class="${sort_field('team')}"></i>
                </a></th>
                <th class="span2"><a href="#" id="birthday">
                    생년월일<i class="${sort_field('birthday')}"></i>
                </a></th>
                <th class="span2">아이디</th>
                <th class="span4">이메일</th>
                <th class="span2">휴대폰</th>
                <th class="span2">내선번호</th>
                <th class="span2">입사일</th>
                <th class="span2">퇴사일</th>
            </tr>
        </thead>
        <tbody class="lists">
            % for employee in users:
            <tr id="${employee.username}" class="list-item">
                <td class="check-item"><input type="checkbox"></td>
                <td class="active-item">
                    <i class="icon-star${'-empty' if not employee.is_active_user() else ''}" title="계정상태"></i>
                </td>
                <td class="span1"><div>${employee.employee_id if employee.employee_id else ''}</div></td>
                <td class="span2"><div>${employee.name if employee.name else ''}</div></td>
                <td class="span2"><div>${employee.get_rank() if employee.join_rank else ''}</div></td>
                <td class="span2"><div>${employee.grade if employee.grade else ''}</div></td>
                <td class="span2"><div>${employee.team if employee.team else ''}</div></td>
                <td class="span2"><div>${str(employee.birthday.date()) if employee.birthday else ''}</div></td>
                <td class="span2"><div></div>${employee.username if employee.username else ''}</td>
                <td class="span4"><div></div>${employee.email if employee.email else ''}</td>
                <td class="span2"><div>${employee.mobile if employee.mobile else ''}</div></td>
                <td class="span2"><div>${employee.phone if employee.phone else ''}</div></td>
                <td class="span2"><div>${str(employee.join_date.date()) if employee.join_date else ''}</div></td>
                <td class="span2"><div>${str(employee.leave_date.date()) if employee.leave_date else ''}</div></td>
            </tr>
            % endfor
        </tbody><!-- list -->
    </table><!-- posts -->
</div>

<style type="text/css">
html { height: 100%; }
td input[type="checkbox"],
th input[type="checkbox"] { margin: 0 0 5px 0; }
.table-wrap { overflow: auto; }
.table td.span1, table th.span1 { min-width: 44px; }
.table td.span2, table th.span2 { min-width: 124px; }
.table td.span3, table th.span3 { min-width: 204px; }
.table td.span4, table th.span4 { min-width: 284px; }
.table td, .table th { vertical-align: middle; }
.active-selected { display: none; }
.list-item { cursor: pointer; }
</style>

<script>
var state_save = false;

function viewUser(e) {
    location.href = "/admin/account/edit/" + $(e.target).parents("tr").prop("id");
}
function doDelete() {
    if (confirm("정말 삭제하시겠습니까?")) {
        var data = [];
        $(".checkmark").each(function() {
            data.push($(this).parents(".list-item").prop('id'))
        });
        var url = "${request.route_path('admin_account')}";
        $.post(url, {"id-list":data.join()}, function(data) {
            location.reload();
        }, "json");
    }
}
function doActivateUser() {
    if (confirm("선택된 사용자에게 계정활성화 요청 메일을 전송하시겠습니까?")) {
        var data = [];
        $(".checkmark").each(function() {
            if ($(this).parents(".list-item").find(".inactive-user")) {
                data.push($(this).parents(".list-item").prop("id"))
            }
        });
        var url = "${request.route_path('admin_account_activate_request')}?host=" + location.host; 
        $.post(url, {"id-list":data.join()}, function() {
            location.reload();
        }, "json");
    }
}
function doDeactivateUser() {
    if (confirm("선택된 사용자를 비활성화 하시겠습니까?")) {
        var data = [];
        $(".checkmark").each(function() {
            if ($(this).parents(".list-item").find(".inactive-user")) {
                data.push($(this).parents(".list-item").prop("id"))
            }
        });
        var url = "${request.route_path('admin_account_deactivate')}"; 
        $.post(url, {"id-list":data.join()}, function() {
            location.reload();
        }, "json");
    }
}
function toggleToolbar(state) {
    if (state_save != state) {
        state_save = state;
        $(".account-menu").toggleClass("active-selected");
    }
}
function toggleCheckedAll(e) {
    $("td.check-item input").prop("checked", e.target.checked);
    toggleToolbar(e.target.checked); 
}
function toggleChecked(e) {
    checks = $("td input:checked").length
    if (checks != $("td input").length)
        $("th input").prop("checked", false);
    toggleToolbar(checks > 0); 
}
function toggleSort(e) {
    var reverse = false;
    var url = "/admin/account?sort=" + $(this).prop("id") 
    
    if ($(this).find(".sort-field").length) {
        url += "&reverse=true";
    }
    location.href = url;
}

var out_height = 0;

$(document).ready(function() {
    out_height += $(".navbar-fixed-top").outerHeight(true);
    out_height += $("header").outerHeight(true);
    out_height += $("div#footer").outerHeight(true);
    out_height += $("section .navbar").outerHeight(true);
    out_height += $("div#description").outerHeight(true);
    out_height += 10;
    
    $("th input").change(toggleCheckedAll);
    $("td input").change(toggleChecked);
    $("td.span1, td.span2, td.span3, td.span4").click(viewUser);
    $("th a").click(toggleSort);
    $(".table-wrap").height($(window).height() - out_height);
});
</script>
