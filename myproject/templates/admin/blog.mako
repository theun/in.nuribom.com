# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>

<%
from myproject.views import log
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

<link rel="stylesheet" type="text/css" href="/static/stylesheets/admin.css">

<div id="top-toolbar">
    <h3>블로그관리</h3>
    <a id="blog-view" class="disable" href="javascript:viewPost()">보기</a>
    <a id="blog-delete" class="disable" href="javascript:doDelete()">삭제</a>
    <div id="description">
    </div>
</div>

<div id="content-body">
<table id="post-list" cellpadding="0" width="100%">
    <tbody class="lists">
        <tr class="list-head">
            <th class="check-item">
                <div id="check-button" class=""></div>
            </th>
            <th class="title-item">
                <div>
                    <span class="${sort_field('title')}"></span>
                    <a href="#" id="title">제목</a>
                </div>
            </th>
            <th class="category-item">
                <div>
                    <span class="${sort_field('category')}"></span>
                    <a href="#" id="category">분류</a>
                </div>
            </th>
            <th class="author-item">
                <div>
                    <span class="${sort_field('author')}"></span>
                    <a href="#" id="author">작성자</a>
                </div>
            </th>
            <th class="pub-item">
                <div>
                    <span class="${sort_field('published')}"></span>
                    <a href="#" id="published">작성일</a>
                </div>
            </th>
            <th class="attachment"><div></div></th>
        </tr>

        % for post in posts:
        <tr id="${post.id}" class="list-item">
            <td class="check-item">
                <div id="check-button" class=""></div>
            </td>
            <td class="title-item"><div id="title">${post.title}</div></td>
            <td class="category-item"><div id="category">${post.category}</div></td>
            <td class="author-item"><div id="author">${post.author.name} ${'(' + str(len(post.comment)) + ')' if len(post.comment) else ''}</div></td>
            <td class="pub-item"><div id="pub_date">${str(post.published.date())}</div></td>
            <td class="attachment"><div id="attachment"><span>
             <img width="21" height="21" class="${'clip-icon' if len(post.attachments) > 0 else ''}" src="/static/images/cleardot.gif" title="첨부파일">
            </span></div></td>
        </tr>
        % endfor
    </tbody><!-- list -->
</table><!-- posts -->
</div>

<script>
function viewPost() {
    $(location).attr("href", "/blog/" + $(".list-item .checkmark").parents(".list-item").prop("id") + "/view")
}
function doDelete() {
    input_data = {}
    $(".checkmark").parents(".list-item").each(function(index) {
        id = $(this).prop('id');
        input_data[id] = index;
    });
    var url = "${request.route_path('admin_blog')}";
    $.post(url, input_data, function(data) {
        $(location).attr("href", "${request.route_path('admin_blog')}");
    }, "json");
}
function toggleToolbar() {
    if ($(".checkmark").size() == 0) {
        $("#blog-delete").hide();
    }
    else {
        $("#blog-delete").show();
    }
    if ($(".checkmark").size() == 1) {
        $("#blog-view").show();
    } else {
        $("#blog-view").hide();
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
    var url = "/admin/blog?sort=" + $(this).prop("id"); 
    
    if ($(this).prev().hasClass("sort-field")) {
        url += "&reverse=true";
    }
    $(location).attr("href", url);
}
$(document).ready(function() {
    $(".list-head .check-item").click(toggleCheckMarkAll);
    $(".list-item").click(toggleCheckMark);
    $("th a").click(toggleSort);
});
</script>
