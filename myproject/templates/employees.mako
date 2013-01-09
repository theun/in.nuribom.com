# -*- coding: utf-8 -*- 

<%inherit file="layout.mako" />
<%
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

<link rel="stylesheet" href="/static/stylesheets/info.css" media="screen" type="text/css" />

<div class="navbar">
    <div class="navbar-inner">
        <a class="brand" id="group-name" href="#">비상연락망</a>
        <ul class="nav">
            <li class="divider-vertical"></li>
            <li><a href="#">${len(users)} 명</a></li>
        </ul>
    </div>
</div>


<div id="content-body">
<table class="table table-hover table-striped" id="employee-list" cellpadding="0" width="100%">
    <tbody class="lists">
        <tr>
            <th class="employeeid-item">
                <div>
                    <span class="${sort_field('employee_id')}"></span>
                    <a href="#" id="employee_id">사번</a>
                </div>
            </td>
            <th class="name-item">
                <div>
                    <span class="${sort_field('name')}"></span>
                    <a href="#" id="name">이름</a>
                </div>
            </td>
            <th class="rank-item">
                <div>
                    <span class="${sort_field('rank')}"></span>
                    <a href="#" id="rank">직위</a>
                </div>
            </td>
            <th class="team-item">
                <div>
                    <span class="${sort_field('team')}"></span>
                    <a href="#" id="team">소속</a>
                </div>
            </td>
            <th class="email-item"><div></div>이메일</td>
            <th class="mobile-item"><div>휴대폰</div></td>
            <th class="phone-item"><div>내선번호</div></td>
        </tr>
        % for employee in users:
        <tr id="${employee.username}" class="list-item">
            <td class="employee_id-item"><div>${employee.employee_id}</div></td>
            <td class="name-item"><div>${employee.name}</div></td>
            <td class="rank-item"><div>${employee.get_rank().strip("-0123456789")}</div></td>
            <td class="team-item"><div>${employee.team}</div></td>
            <td class="email-item"><div></div>${employee.email}</td>
            <td class="mobile-item"><div>${employee.mobile}</div></td>
            <td class="phone-item"><div>${employee.phone}</div></td>
        </tr>
        % endfor
    </tbody><!-- list -->
</table><!-- posts -->
</div>

<script>
function viewUser(e) {
    $(location).attr("href", "/account/" + $(this).prop("id") + "/info/basic")
}
function toggleSort(e) {
    var reverse = false;
    var url = "/employees?sort=" + $(this).prop("id") 
    
    if ($(this).prev().hasClass("sort-field")) {
        url += "&reverse=true";
    }
    $(location).attr("href", url);
}
$(document).ready(function() {
    $(".lists .list-item").click(viewUser);
    $("th a").click(toggleSort);
});
</script>
