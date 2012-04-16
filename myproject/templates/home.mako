# -*- coding: utf-8 -*- 

<%inherit file="layout.mako"/>

<link rel="stylesheet" href="/static/stylesheets/blog.css" media="screen" type="text/css" />

<div id="posts">
  <div class="list" style="width: 100%;">
    <ul>
      % for post in posts:
      <li class="hentry post" id="${post.id}">
        <h2>
          <a href="${request.route_url('blog_view', id=post.id)}" class="reverse url entry-title">${post.title}</a>
          <small></small>
        </h2>
        <div class="meta">
          <span>${post.author}</span> |
          <span>${str(post.published.date())}</span>
        </div>
        <hr>
        <div class="entry-content">
        <%
        from markdown import markdown
        content = markdown(post.content) 
        %>
          ${content|n} 
        </div>
        <p align="right">
          <a href="${request.route_url('blog_view', id=post.id)}#comments">${len(post.comment)} Comments</a>
        </p>
      </li>
      % endfor
    </ul>
  </div><!-- list -->
</div><!-- posts -->
