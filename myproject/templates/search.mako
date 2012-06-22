# -*- coding: utf-8 -*- 

<%inherit file="layout.mako"/>

<%
from myproject.views import log, image_thumbnail_info
from myproject.blog import get_time_ago
from myproject.models import User, Team, Post
from bson import ObjectId
from pyramid.security import authenticated_userid
%>

% if request.current_route_path().split('/')[1] != 'search': 
<div id="top-toolbar">
    <h3>검색결과</h3>
    <div id="description">
    </div>
</div>
% endif

<div id="content-body">
    <div id="post-list">
        % for result in results:
        <div id="${result['id']}" class="post clearfix" style="cursor:default;">
            % if result['collection'] == 'User':
                <% user = User.objects.with_id(ObjectId(result['id'])) %>
                <img class="post-photo" src="${request.route_path('account_photo', username=user.username)}">
                <div class="post-main">
                    <p class="post-title">
                        사용자:
                        <a href="${request.route_path('account_info', username=user.username, category='basic')}">
                            ${user.name}
                        </a>
                    </p>
                    <div class="post-info">
                        <a class="post-user" href="${request.route_path('team_view', tid=Team.objects(name=user.team).first().id)}">
                            <span>${user.get_team_path()}</span>
                        </a>
                        <span class="post-time">· ${user.get_rank().strip("-0123456789")}</span>
                        | <span class="post-tools">
                            <a href="mailto:${user.email}">${user.email}</a>
                            |<a href="tel:${user.mobile}">${user.mobile}</a>
                            |<a href="tel:${user.phone}">${user.phone}</a>
                        </span>
                    </div>
                </div>
            % else:
                <% post = Post.objects.with_id(ObjectId(result['id'])) %>
                <img class="post-photo" src="${request.route_path('account_photo', username=post.author.username)}">
                <div class="post-main">
                    <p class="post-title">
                        ${post.category.name if post.category else u"새소식"}:
                        <a href="${request.route_path('blog_view', id=post.id)}">
                            ${post.title}
                        </a>
                    </p>
                    <div class="post-content highlighted">
                    ${result['highlight']|n}
                    </div>
                    <div class="post-info">
                        <a class="post-user" href="${request.route_path('account_main', username=post.author.username)}">
                            <span>${post.author}</span>
                        </a>
                        <span class="post-time">· ${get_time_ago(post.published)}</span>
                    </div>
                </div>
            % endif
        </div>
        % endfor
    </div>
    <nav id="page_nav">
        <a href="${request.route_path('search_all') + '?q=' + request.params['q'] + '&page=2'}"></a>
    </nav>
</div>

<link rel="stylesheet" href="/static/stylesheets/blog.css" media="screen" type="text/css" />
<script src="/static/javascripts/jquery.isotope.min.js"></script>
<script src="/static/javascripts/jquery.infinitescroll.js"></script>

<script>
    $('#post-list').infinitescroll({
        navSelector  : '#page_nav',    // selector for the paged navigation 
        nextSelector : '#page_nav a',  // selector for the NEXT link (to page 2)
        itemSelector : 'div.post',     // selector for all items you'll retrieve
        loading: {
            finishedMsg: '',
            img: '/static/images/busy.gif'
        }
    });
    
    function scroll() {
        if ($(document).height() - $(window).height() == 0) {
            $(window).scroll();
            setTimeout(scroll, 300);
        }
    }
    $(document).ready(function() {
        scroll();
        % if 'q' in request.params:
        $("#global-search-field").val("${request.params['q']}");
        % endif
    });
</script>
