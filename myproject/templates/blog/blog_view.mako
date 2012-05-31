# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>
<%
from myproject.views import log
from myproject.blog import get_time_ago
from pyramid.security import authenticated_userid
%>

<div id="content-body">
<div id="posts">
  <div class="list">
      <div class="hentry post" id="${post.id}">
        <a class="photo-id" href="${request.route_path('account_main', username=post.author.username)}">
            <img src="${request.route_path('account_photo', username=post.author.username)}">
        </a>
        <div class="entry-content">
            % if post.author.username == authenticated_userid(request): 
            <a class="tool-button" href="javascript:doDelete()">삭제</a>
            <a class="tool-button" href="${request.route_path('blog_edit', id=post.id)}">편집</a>
            % else:
            <span> </span>
            % endif
            <div id="post-title">${post.title}</div>
            <div id="post-body">
                ${post.content|n}
            </div> 
            <div class="post-info">
                <a class="cuser" href="${request.route_path('account_main', username=post.author.username)}">
                    <span>${post.author}</span>
                </a>
                | <span>${get_time_ago(post.published)}</span>
                <span id="tags">
                    <img id="edit-tag" width="16" height="16" src="/static/images/tag.png" title="태그편집">
                % for tag in post.tags:
                    <a href="${request.route_path('search_tag', tag=tag)}">${tag}</a>,
                % endfor
                </span>
                <span id="edit-tags" class="hidden">
                    <input type=text id="input-tags" name="input-tags">
                    <div>
                        태그이름을 컴마(,)로 구분해서 입력하세요.
                    </div>
                </span>
            </div>
        </div>
      </div>
      <div id="comments" class="new-comments blog-comments">
        % for i in range(len(post.comment)):
        <div id="comment_${i}" class="comment blog-comment">
            <a class="photo-id" href="${request.route_path('account_main', username=post.comment[i].author.username)}">
                <img src="${request.route_path('account_photo', username=post.comment[i].author.username)}">
            </a>
            % if authenticated_userid(request) == post.comment[i].author.username:
            <a class="del-button" href="${request.route_path('blog_comment_del', bid=post.id, cid=i)}">삭제</a>
            % else:
            <span></span>
            % endif
            <div class="body">
                <a class="cuser" href="${request.route_path('account_main', username=post.comment[i].author.username)}">
                    ${post.comment[i].author.name}
                </a>
                <span class="formatted-content content-body markdown-body">
                    ${post.comment[i].content|n}
                </span>
                <div class="cinfo">
                    <em class="date">${get_time_ago(post.comment[i].posted)}</em>
                </div>
            </div>
        </div>
        % endfor
        <form accept-charset="UTF-8" action="${request.route_path('blog_comment_add', bid=post.id)}"
              id="new-comment" class="new-comment" method="post">
            <div class="photo-id">
                <img src="${request.route_path('account_photo', username=authenticated_userid(request))}">
            </div>
            <div class="comment-form">
                <textarea name="comment" tabindex="1" id="comment"></textarea>
                <button type="submit" id="add-comment" style="display:none" class="classy primary form-actions" tabindex="2">
                    <span>Comment</span>
                </button>
            </div>
        </form>
      </div><!-- comments -->
  </div><!-- list -->
</div><!-- posts -->
</div>

<link rel="stylesheet" href="/static/stylesheets/blog.css" media="screen" type="text/css" />
<script>
function doDelete() {
    if (confirm("정말 삭제하시겠습니까?")) {
        var url = "${request.route_path('blog_remove', id=post.id)}";
        $.post(url, function() {
            % if post.category:
            $(location).attr("href", "${request.route_path('blog_list')}?category=${post.category}");
            % else:
            $(location).attr("href", "${request.route_path('blog_list')}");
            % endif
        }, "json");
    }
}
function doResizeTextArea(e) {
    $(this).height($(this).get(0).scrollHeight-4);
}
function doSaveTag() {
    var data = $("#input-tags").val().trim().split(',')
    console.log(data);
    var url = "${request.route_path('blog_tag_edit', id=post.id)}"
    $.post(url, {"tags":data.join()}, function() {
        location.reload();
    }, "json");
}
function doEditTag() {
    var tags = ''
    $(".post-info #tags a").each(function() {
        tags += $(this).html() + ', '
    });
    $("#input-tags").val(tags);
    $("#tags, #edit-tag").hide();
    $("#edit-tags").show();
    $("#input-tags").focus();
}
function doCancelTag() {
    $("#edit-tags").hide();
    $("#input-tags").val("");
    $("#tags, #edit-tag").show();
}
$(document).ready(function() {
    $("#comment").keyup(doResizeTextArea); 
    $("#comment").keydown(function(event) {
        if (event.which == 13) {
            $("#add-comment").click();
        }
    });
    $("#edit-tag").click(doEditTag);
    $("#input-tags").keydown(function(event) {
        if (event.which == 13) {
            doSaveTag();
        }
        if (event.which == 27) {
            doCancelTag();
        }
    });
});
</script>