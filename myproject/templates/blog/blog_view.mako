# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>
<%
from myproject.views import log
from datetime import datetime
from pyramid.security import authenticated_userid
%>

<div id="top-toolbar">
    <h3><a href="${request.route_path('blog_list', category=post.category)}">${post.category}</a></h3>
    % if post.author.username == authenticated_userid(request): 
    <a href="javascript:doDelete()">삭제</a>
    <a href="${request.route_path('blog_edit', id=post.id)}">편집</a>
    % endif
    <div id="description">
    </div>
</div>
<div id="posts">
  <div class="list">
      <div class="hentry post" id="${post.id}">
        <h2 class="post-title">
			${post.title}
        </h2>
        <div id="user" class="meta">
            <div class="photo-id">
                <a href="${request.route_path('account_main', username=post.author.username)}">
                    <img src="${request.route_path('account_photo', username=post.author.username)}">
                </a>
            </div>
            <div class="post-info">
                <a href="${request.route_path('account_main', username=post.author.username)}">
                    <span>${post.author}</span> |
                </a>
                <span>${str(post.published.date())}</span>
            </div>
        </div>
        <div class="entry-content">
          ${post.content|n} 
        </div>
        % if post.attachments:
        <div class="post-attachment">
            <p><strong>첨부파일 ${len(post.attachments)}개</strong></p>
            % for file in post.attachments:
            <p>
                <a href="${request.route_path('blog_attachment', id=post.id, filename=file.name)}">${file.name} (${file.length/1024}K)</a>
            </p>
            % endfor
        </div>
        % endif
      </div>
      <br />
      <h3>${len(post.comment)} Comments</h3>
      <div id="comments" class="new-comments blog-comments">
        % for i in range(len(post.comment)):
        <div id="comment_${i}" class="comment blog-comment">
          <div class="cmeta">
            % if 'author' in post.comment[i]:
            <div class="photo-id">
                <a href="${request.route_path('account_main', username=post.comment[i].author.username)}">
                    <img src="${request.route_path('account_photo', username=post.comment[i].author.username)}">
                </a>
            </div>
            <div class="cuser">
                ${post.comment[i].author.name}
            </div>
            % else:
            <div class="photo-id">
                <img src="${request.route_path('account_photo', username='_unknown_')}">
            </div>
            % endif
            <div class="cinfo">
                <em class="date">${str(post.comment[i].posted.date())}</em>
                % if authenticated_userid(request) == post.comment[i].author.username:
                <a href="${request.route_path('blog_comment_del', bid=post.id, cid=i)}" class="del-button">삭제</a>
                % endif
            </div>
          </div>
          <div class="body">
            <div class="formatted-content">
              <div class="content-body markdown-body ">
                ${post.comment[i].content|n}
              </div>
            </div>
          </div>
        </div>
        % endfor
        <form accept-charset="UTF-8" action="${request.route_path('blog_comment_add', bid=post.id)}"
              id="new_comment" class="new_comment" method="post">
            <div class="photo-id">
                <a href="${request.route_path('account_main', username=authenticated_userid(request))}">
                    <img src="${request.route_path('account_photo', username=authenticated_userid(request))}">
                </a>
            </div>
            <div class="comment-form">
                <textarea name="comment" tabindex="1" id="comment"></textarea>
            </div>
            <div class="form-actions">
                <button type="submit" class="classy primary" tabindex="2">
                    <span>Comment</span>
                </button>
            </div>
        </form>
      </div><!-- comments -->
  </div><!-- list -->
</div><!-- posts -->

<link rel="stylesheet" href="/static/stylesheets/blog.css" media="screen" type="text/css" />
<script>
function doDelete() {
    if (confirm("정말 삭제하시겠습니까?")) {
        var url = "${request.route_path('blog_remove', id=post.id)}";
        $.post(url, function() {
            $(location).attr("href", "${request.route_path('blog_list', category=post.category)}");
        });
    }
}
</script>