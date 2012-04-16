# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>

<link rel="stylesheet" href="/static/stylesheets/blog.css" media="screen" type="text/css" />

% if login: 
<div align="right">
  <a href="${request.route_url('blog_post')}" class="button classy first-in-line" rel="nofollow"><span>새글</span></a>
</div>
% endif

<div id="posts">
  <div class="list" style="width: 100%;">
    <ul>
      % for post in posts:
      <li class="hentry post" id="${post.id}">
        <h2>
          <a href="${request.route_url('blog_view', id=post.id)}" class="reverse url entry-title">${post.title}</a>
          <small></small>
        </h2>
        <div id="user" class="meta">
          <a href="${request.route_url('account_main', username=post.author.username)}">
            <img height="20" src="${request.route_url('account_photo', username=post.author.username)}">
            <span>${post.author}</span> |
          </a>
          <span>${str(post.published.date())}</span> |
          <a href="${request.route_url('blog_view', id=post.id)}#comments">${len(post.comment)} Comments</a>
        </div>
        <hr>
        <div class="entry-content">
        <%
        from markdown import markdown
        content = markdown(post.content)
        %>
          ${content|n} 
        </div>
      </li>
      % endfor
    </ul>
    <div class="pagination">
    % if page == 0:
      <span class="disabled"><< 이전</span>
    % else:
      <a href="${request.route_url('blog_list', page=(page-1))}"><< 이전</a>
    % endif
    % for no in range(pages):
      % if page == no:
      <span class="current">${page+1}</span>
      % else:
      <a href="${request.route_url('blog_list', page=no)}">${no+1}</a>
      % endif
    % endfor
    % if page == (pages-1):
      <span class="disabled">다음 >></span>
    % else:
      <a href="${request.route_url('blog_list', page=(page+1))}">다음 >></a>
    % endif
    </div>
  </div><!-- list -->
</div><!-- posts -->
