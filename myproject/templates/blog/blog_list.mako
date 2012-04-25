# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>

<%
from myproject.views import log
from pyramid.security import authenticated_userid
%>

% if authenticated_userid(request): 
<div id="top-toolbar">
    <h3>${category}</h3>
    <a href="${request.route_url('blog_post', category=category)}">새글</a>
    <div id="description">
    </div>
</div>
% endif

<div id="content-body">
<table id="post-list" cellpadding="0">
    <tbody class="lists">
        % for post in posts:
        <tr id="${post.id}" class="list-item">
            <td class="title-item"><div id="title">${post.title}</div></td>
            <td class="name-item"><div id="name">${post.author.name} ${'(' + str(len(post.comment)) + ')' if len(post.comment) else ''}</div></td>
            <td class="pub-item"><div id="pub_date">${str(post.published.date())}</div></td>
            <td class="attachment"><div id="attachment"><span>
             <img width="21" height="21" class="${'clip-icon' if len(post.attachments) > 0 else ''}" src="/static/images/cleardot.gif" title="첨부파일">
            </span></div></td>
        </tr>
        % endfor
    </tbody><!-- list -->
</table><!-- posts -->
</div>

<link rel="stylesheet" href="/static/stylesheets/blog.css" media="screen" type="text/css" />

<script>
function viewPost(e) {
    $(location).attr("href", "/blog/" + $(this).prop("id") + "/view")
}

$(document).ready(function() {
    $(".list-item").click(viewPost);
});
</script>
