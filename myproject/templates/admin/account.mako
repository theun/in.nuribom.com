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
            return 'ui-icon ui-icon-triangle-1-s reverse-field'
        else:
            return 'ui-icon ui-icon-triangle-1-n sort-field'
    else:
        return 'ui-icon ui-icon-grip-dotted-vertical normal-field'

def get_active_account():
    return len(User.objects(Q(leave_date='') & Q(join_date__ne='') & Q(activate='') & Q(password__ne='')))

def get_work_account():
    return len(User.objects(Q(leave_date='') & Q(join_date__ne='')))

def get_leave_account():
    return len(User.objects(leave_date__ne=''))

%>

<link rel="stylesheet" href="/static/stylesheets/admin.css" media="screen" type="text/css" />

<div id="top-toolbar">
    <h3>계정관리 : ${len(users)}명</h3>
    <a id="account-edit" class="disable" href="javascript:viewUser()">편집</a>
    <a id="account-activate" class="disable" href="javascript:doActivateUser()">계정활성화</a>
    % if login and 'group:admin' in login.groups:
    <a id="account-delete" class="disable" href="javascript:doDelete()">삭제</a>
    % endif
    <a id="account-add" href="${request.route_path('admin_account_edit', username='__new__')}">추가</a>
    <div id="description">
    <p>활성계정: ${get_active_account()}명, 재직중: ${get_work_account()}명, 퇴직 : ${get_leave_account()}명</p>
    <p>계정을 편집하시려면 해당 계정을 클릭하세요.</p>
    </div>
</div>

<div id="content-body">
<table id="employee-list" cellpadding="0" width="100%">
    <tbody class="lists">
        <tr class="list-head">
            <th class="check-item">
                <div id="check-button" class=""></div>
            </th>
            <th class="active-item">
                <div id="active-button" class=""></div>
            </th>
            <th class="employeeid-item">
                <div>
                    <span class="${sort_field('employee_id')}"></span>
                    <a href="#" id="employee_id">사번</a>
                </div>
            </th>
            <th class="name-item">
                <div>
                    <span class="${sort_field('name')}"></span>
                    <a href="#" id="name">이름</a>
                </div>
            </th>
            <th class="rank-item">
                <div>
                    <span class="${sort_field('rank')}"></span>
                    <a href="#" id="rank">직위</a>
                </div>
            </th>
            <th class="grade-item">
                <div>
                    <span class="${sort_field('grade')}"></span>
                    <a href="#" id="grade">직급</a>
                </div>
            </th>
            <th class="department-item">
                <div>
                    <span class="${sort_field('team')}"></span>
                    <a href="#" id="team">소속</a>
                </div>
            </th>
            <th class="birthday-item">
                <div>
                    <span class="${sort_field('birthday')}"></span>
                    <a href="#" id="birthday">생년월일</a>
                </div>
            </th>
            <th class="email-item">
                <div>이메일</div>
            </th>
            <th class="mobile-item">
                <div>휴대폰</div>
            </th>
            <th class="phone-item">
                <div>내선번호</div>
            </th>
            <th class="join_date-item">
                <div>입사일</div>
            </th>
            <th class="leave_date-item">
                <div>퇴사일</div>
            </th>
        </tr>

        % for employee in users:
        <tr id="${employee.username}" class="list-item">
            <td class="check-item">
                <div id="check-button" class=""></div>
            </td>
            <td class="active-item">
                <div id="active-button" class="${'active-user' if employee.is_active_user() else 'inactive-user'}"></div>
            </td>
            <td class="employeeid-item"><div>${employee.employee_id if employee.employee_id else ''}</div></td>
            <td class="name-item"><div>${employee.name if employee.name else ''}</div></td>
            <td class="rank-item"><div>${employee.get_rank() if employee.join_rank else ''}</div></td>
            <td class="grade-item"><div>${employee.grade if employee.grade else ''}</div></td>
            <td class="department-item"><div>${employee.team if employee.team else ''}</div></td>
            <td class="birthday-item"><div>${str(employee.birthday.date()) if employee.birthday else ''}</div></td>
            <td class="email-item"><div></div>${employee.email if employee.email else ''}</td>
            <td class="mobile-item"><div>${employee.mobile if employee.mobile else ''}</div></td>
            <td class="phone-item"><div>${employee.phone if employee.phone else ''}</div></td>
            <td class="join_date-item"><div>${str(employee.join_date.date()) if employee.join_date else ''}</div></td>
            <td class="leave_date-item"><div>${str(employee.leave_date.date()) if employee.leave_date else ''}</div></td>
        </tr>
        % endfor
    </tbody><!-- list -->
</table><!-- posts -->
</div>

<script>
function viewUser(e) {
    $(location).attr("href", "/admin/account/edit/" + $(".checkmark").parents(".list-item").prop("id"))
}
function doDelete() {
    input_data = {}
    $(".checkmark").parents(".list-item").each(function(index) {
        id = $(this).prop('id');
        input_data[id] = index;
    });
    var url = "${request.route_path('admin_account')}";
    $.post(url, input_data, function(data) {
        $(location).attr("href", "${request.route_path('admin_account')}");
    }, "json");
}
function doActivateUser() {
    $(".checkmark").parents(".list-item").each(function() {
        if ($(this).find(".inactive-user")) {
            $.get("/admin/account/activate_request/" + $(this).attr("id"));
        }
    });
    $(location).attr("href", $(location).attr("href"));
}
function toggleToolbar() {
    var checked = $(".checkmark").size();
    if (checked == 0) {
    % if login and 'group:admin' in login.groups:
        $("#account-delete").hide();
    % endif
        $("#account-activate").hide();
        $("#account-add").show();
    }
    else {
    % if login and 'group:admin' in login.groups:
        $("#account-delete").show();
    % endif
        $("#account-activate").show();
        $("#account-add").hide();
    }
    if (checked == 1) {
        $("#account-edit").show();
    } else {
        $("#account-edit").hide();
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
    var url = "/admin/account?sort=" + $(this).prop("id") 
    
    if ($(this).prev().hasClass("sort-field")) {
        url += "&reverse=true";
    }
    $(location).attr("href", url);
}
$(document).ready(function() {
    $(".lists .list-item").click(toggleCheckMark);
    $(".list-head .check-item").click(toggleCheckMarkAll);
    $("th a").click(toggleSort);
});
</script>
