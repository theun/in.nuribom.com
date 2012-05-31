# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>

<%
from myproject.views import log
from myproject.blog import get_time_ago
%>

% if request.current_route_path().split('/')[1] != 'search': 
<div id="top-toolbar">
    <h3>${category if category else u''}</h3>
    % if category:
    <a href="${request.route_path('blog_post')}?category=${category}">새글</a>
    % else:
    <a href="${request.route_path('blog_post')}">새글</a>
    % endif
    <div id="description">
    </div>
</div>
% endif

<div id="content-body">
<div id="post-list">
    % for post in posts:
    <div id="${post.id}" class="list-item">
        <img id="photo" src="${request.route_path('account_photo', username=post.author.username)}">
        <div id="post-main">
            <p id="title">${post.title}</p>
            ${post.content|n}
            <div class="post-info">
                <a class="cuser" href="${request.route_path('account_main', username=post.author.username)}">
                    <span>${post.author}</span>
                </a>${'(%d)' % len(post.comment) if len(post.comment) else ''}
                | <span>${get_time_ago(post.published)}</span>
                <span id="tags">
                    <img width="16" height="16" src="/static/images/tag.png" title="태그">
                % for tag in post.tags:
                    <a href="${request.route_path('search_tag', tag=tag)}">${tag}</a>,
                % endfor
                </span>
            </div>
        </div>
    </div>
    % endfor
</div>
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
