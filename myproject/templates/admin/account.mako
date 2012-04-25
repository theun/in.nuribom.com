# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako" />

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

<link rel="stylesheet" href="/static/stylesheets/admin.css" media="screen" type="text/css" />

<div id="top-toolbar">
    <h3>계정 관리</h3>
    <a href="javascript:doActivateUser()">계정활성화</a>
    <a href="${request.route_url('admin_account_edit', username='__new__')}">추가</a>
    <div id="description">
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
            <th class="username-item">
                <div>
                    <span class="${sort_field('username')}"></span>
                    <a href="#" id="name">아이디</a>
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
            <th class="en_name-item">
                <div>영문이름</div>
            </th>
            <th class="email-item">
                <div>이메일</div>
            </th>
            <th class="email1-item">
                <div>메신저</div>
            </th>
            <th class="mobile-item">
                <div>휴대폰</div>
            </th>
            <th class="phone-item">
                <div>내선번호</div>
            </th>
            <th class="phone1-item">
                <div>집전화</div>
            </th>
            <th class="join_rank-item">
                <div>입사직위</div>
            </th>
            <th class="join_date-item">
                <div>입사일</div>
            </th>
            <th class="leave_date-item">
                <div>퇴사일</div>
            </th>
            <th class="job_summary-item">
                <div>업무요약</div>
            </th>
            <th class="address-item">
                <div>주소</div>
            </th>
            <th class="address1-item">
                <div>부가주소</div>
            </th>
        </tr>

        % for employee in users:
        <tr id="${employee.username}" class="list-item">
            <td class="check-item">
                <div id="check-button" class=""></div>
            </td>
            <td class="active-item">
                <div id="active-button" class="${'active-user' if employee.password and not employee.leave_date else 'inactive-user'}"></div>
            </td>
            <td class="employeeid-item"><div>${employee.employee_id}</div></td>
            <td class="name-item"><div>${employee.name}</div></td>
            <td class="username-item"><div>${employee.username}</div></td>
            <td class="rank-item"><div>${employee.get_rank()}</div></td>
            <td class="grade-item"><div>${employee.grade}</div></td>
            <td class="department-item"><div>${employee.team}</div></td>
            <td class="birthday-item"><div>${str(employee.birthday.date()) if employee.birthday else ''}</div></td>
            <td class="en_name-item"><div>${employee.en_name if employee.en_name else ''}</div></td>
            <td class="email-item"><div></div>${employee.email if employee.email else ''}</td>
            <td class="email1-item"><div></div>${employee.email1 if employee.email1 else ''}</td>
            <td class="mobile-item"><div>${employee.mobile if employee.mobile else ''}</div></td>
            <td class="phone-item"><div>${employee.phone if employee.phone else ''}</div></td>
            <td class="phone1-item"><div>${employee.phone1 if employee.phone1 else ''}</div></td>
            <td class="join_rank-item"><div>${employee.join_rank if employee.join_rank else ''}</div></td>
            <td class="join_date-item"><div>${str(employee.join_date.date()) if employee.join_date else ''}</div></td>
            <td class="leave_date-item"><div>${str(employee.leave_date.date()) if employee.leave_date else ''}</div></td>
            <td class="job_summary-item"><div>${employee.job_summary if employee.job_summary else ''}</div></td>
            <td class="address-item"><div>${employee.address if employee.address else ''}</div></td>
            <td class="address1-item"><div>${employee.address1 if employee.address1 else ''}</div></td>
        </tr>
        % endfor
    </tbody><!-- list -->
</table><!-- posts -->
</div>

<script>
function viewUser(e) {
    $(location).attr("href", "/admin/account/edit/" + $(this).prop("id"))
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
function toggleSort(e) {
    var reverse = false;
    var url = "/admin/account?sort=" + $(this).prop("id") 
    
    if ($(this).prev().hasClass("sort-field")) {
        url += "&reverse=true";
    }
    $(location).attr("href", url);
}
function ignoreClick(e) {
    return false;
}
function doActivateUser() {
    $(".checkmark").parents(".list-item").each(function() {
        var url = "/admin/account/activate_request/" + $(this).attr("id");
        $.get(url);
    });
    $(location).attr("href", $(location).attr("href"));
}
$(document).ready(function() {
    $(".lists .list-item").click(viewUser);
    $(".list-head .check-item").click(toggleCheckMarkAll);
    $(".list-item .check-item").click(toggleCheckMark);
    $(".list-item .active-item").click(ignoreClick);
    $("th a").click(toggleSort);
});
</script>
