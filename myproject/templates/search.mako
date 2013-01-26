# -*- coding: utf-8 -*- 

<%
from myproject.blog import get_time_ago
from myproject.models import User, Team, Post
from bson import ObjectId
from pyramid.security import authenticated_userid
%>

<div class="navbar">
    <div class="navbar-inner">
        <a class="brand" id="group-name" href="#">검색결과: ${query}</a>
    </div>
</div>

<div id="content-body">
    <div id="post-list">
        % for result in results:
        <div id="${result['id']}" class="post clearfix" style="cursor:default;">
            % if result['collection'] == 'User':
            <div class="post-inner">
                <% user = User.objects.with_id(ObjectId(result['id'])) %>
                <img class="post-photo" src="${request.route_path('account_photo', username=user.username)}">
                <div class="post-main">
                    <p class="post-title">
                        <a href="${request.route_path('account_info', username=user.username, category='basic')}">
                            ${user.name}
                        </a>
                        ( ${user.get_rank().strip("-0123456789")} )
                    </p>
                    <p>
                        <a class="post-user" href="${request.route_path('team_view', tid=Team.objects(name=user.team).first().id)}">
                            <span>${user.get_team_path()}</span>
                        </a>
                    </p>
                    <p>
                        <a href="mailto:${user.email}">${user.email}</a>
                    </p>
                    <p>
                        <a href="tel:${user.mobile}">${user.mobile}</a>
                    </p>
                    <p>
                        <a href="tel:${user.phone}">${user.phone}</a>
                    </p>
                </div>
            </div>
            % else:
            <div class="post-inner">
                <% post = Post.objects.with_id(ObjectId(result['id'])) %>
                <img class="post-photo" src="${request.route_path('account_photo', username=post.author.username)}">
                <div class="post-main">
                    <p class="post-title">
                        ${post.category.name if post.category else u"새소식"} |
                        <a href="${request.route_path('blog_view', id=post.id)}">
                            ${post.title}
                        </a>
                    </p>
                    <div class="post-meta">
                        <a class="post-user" href="${request.route_path('account_main', username=post.author.username)}">
                            <span>${post.author}</span>
                        </a>
                        <span class="post-time">· ${get_time_ago(post.modified)}</span>
                    </div>
                </div>
                <div class="post-content highlighted">
                ${result['highlight']|n}
                </div>
            </div>
            % endif
        </div>
        % endfor
    </div>
    <nav id="page_nav">
        <a href="#/search/${query}/${page+1}"></a>
    </nav>
</div>

<script>
    $('#post-list').infinitescroll({
        navSelector  : '#page_nav',    // selector for the paged navigation 
        nextSelector : '#page_nav a',  // selector for the NEXT link (to page 2)
        itemSelector : 'div.post',     // selector for all items you'll retrieve
        loading: {
            finishedMsg: '',
            img: '/static/img/busy.gif'
        }
    });
    
    function scroll() {
        if ($(document).height() - $(window).height() == 0) {
            $(window).scroll();
            setTimeout(scroll, 300);
        }
    }
</script>
