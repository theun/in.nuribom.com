# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>

<%
from myproject.views import log
from pyramid.security import authenticated_userid
%>

% if authenticated_userid(request): 
<div id="top-toolbar">
    <h3>${category}</h3>
    <a href="${request.route_path('blog_post', category=category)}">새글</a>
    <div id="description">
    </div>
</div>
% endif

<div id="content-body">
<ol id="post-list">
    % for post in posts:
    <li id="${post.id}" class="list-item">
        <img id="photo" src="${request.route_path('account_photo', username=post.author.username)}">
        <p id="title">${post.title}
            <img align="top" width="21" height="21" class="${'clip-icon' if len(post.attachments) > 0 else ''}" src="/static/images/cleardot.gif" title="첨부파일">
        </p>
        <div class="post-info meta">
            <a href="${request.route_path('account_main', username=post.author.username)}">${post.author.name}</a>
            ${'(%d)' % len(post.comment) if len(post.comment) else ''}
            ${str(post.published.date())}
        </div>
    </li>
    % endfor
</ol>
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
