# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>

<link rel="stylesheet" href="/static/stylesheets/blog.css" media="screen" type="text/css" />

<div id="posts">
  <div class="list">
    <ul>
      <li class="hentry post" id="${post.id}">
        <span>
			<a href="${request.route_url('blog_remove', id=post.id)}" class="right-align" rel="nofollow">삭제</a>
			<a href="${request.route_url('blog_edit', id=post.id)}" class="right-align" rel="nofollow">편집</a>
		</span>
        <h2>
			<a href="${request.route_url('blog_view', id=post.id)}" class="reverse url entry-title">${post.title}</a>
        </h2>
        <div id="user" class="meta">
          <a href="${request.route_url('account_main', username=post.author.username)}">
            <img height="20" src="${request.route_url('account_photo', username=post.author.username)}">
          </a>
          <span>${post.author}</span> |
          <span>${str(post.published.date())}</span>
        </div>
        <hr>
        <div class="entry-content">
          ${post.content|n} 
        </div>
      </li>
      
      <h3>${len(post.comment)} Comments</h3>
      <div id="comments" class="new-comments blog-comments">
        % for i in range(len(post.comment)):
        <div id="comment_${i}" class="comment blog-comment">
          <div class="cmeta">
            <p class="author"><strong>${post.comment[i].name}</strong></p>
            <p class="info">
              <em class="date">${str(post.comment[i].posted.date())}</em>
              <span class="icon"></span>
              <strong style="font-size:110%">
                <a href="${request.route_url('blog_comment_del', bid=post.id, cid=i)}"> [삭제] </a>
              </strong>
            </p>
          </div>
          <div class="body">
            <div class="formatted-content">
              <div class="content-body markdown-body ">
                ${markdown(post.comment[i].content)|n}
              </div>
            </div>
          </div>
        </div>
        % endfor
        <form accept-charset="UTF-8" action="${request.route_url('blog_comment_add', bid=post.id)}"
              id="new_comment" class="new_comment" method="post">
          <div class="comment-form">
            <span class="help right-align">(parsed with <a href="http://github.github.com/github-flavored-markdown/" class="gfm-help" target="_blank">Flavored Markdown</a>)</span>
            <textarea name="comment" tabindex="1" id="comment"></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="classy primary" tabindex="2">
              <span>Comment</span>
            </button>
          </div>
        </form>
      </div><!-- comments -->
    </ul>
  </div><!-- list -->
</div><!-- posts -->


