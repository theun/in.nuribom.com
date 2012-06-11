# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>
<%
from myproject.views import log, image_thumbnail_info
from myproject.blog import get_time_ago
from myproject.models import User
from datetime import datetime
from pyramid.security import authenticated_userid

comments_len = len(post.comments)

page = 0
num_images = 15
if 'page' in request.params:
    page = int(request.params['page']) - 1

def is_image_gallery():
    return post.content.strip() == ""
%>

<%def name="image_gallery()">
    <p>${len(post.images)}장의 사진이 있습니다.</p> 

    % if page * num_images < post.images:
    <div id="gallery" class="clearfix">
        % for url in post.images[page*num_images:(page+1)*num_images]:
        <% info = image_thumbnail_info(url.split('/')[-1]) %>
        <div class="box">
            <p>
                <a href="${url}" rel="prettyPhoto[pp_gal]" title="${info['name']}">
                    <img width="${info['width']}" height="${info['height']}" src="${url + '/thumbnail'}" />
                </a>
            </p>
        </div>
        % endfor
    </div>
    <nav id="page_nav">
        <a href="${request.route_path('blog_view', id=post.id) + '?page=2'}"></a>
    </nav>
    
    <script src="/static/javascripts/jquery.isotope.min.js"></script>
    <script src="/static/javascripts/jquery.infinitescroll.min.js"></script>
    <link rel="stylesheet" href="/static/prettyPhoto/css/prettyPhoto.css" type="text/css" media="screen" charset="utf-8" />
    <script src="/static/prettyPhoto/js/jquery.prettyPhoto.js" type="text/javascript" charset="utf-8"></script>
    <script>
        function doDeletePhoto() {
            if (confirm("사진을 삭제하시겠습니까?")) {
                $.post("/blog/${post.id}" + $("#fullResImage").attr("src") + "/delete", function() {
                    location.reload();
                }); 
            }
        }
        
        $(function(){
            $("a[rel^='prettyPhoto']").prettyPhoto({
                social_tools: '<a href="javascript:doDeletePhoto()">사진삭제</a>',
            });
            var $gallery = $('#gallery');
            $gallery.imagesLoaded( function(){
                $gallery.isotope({
                    itemSelector: '.box',
                });
            });
            $gallery.infinitescroll(
                {
                    navSelector  : '#page_nav',    // selector for the paged navigation 
                    nextSelector : '#page_nav a',  // selector for the NEXT link (to page 2)
                    itemSelector : 'div.box',     // selector for all items you'll retrieve
                    loading: {
                        finishedMsg: 'No more pages to load.',
                        img: 'http://i.imgur.com/qkKy8.gif'
                    }
                },
                // call Isotope as a callback
                function( newElements ) {
                    $gallery.isotope( 'appended', $( newElements ) ); 
                }
            );
        });
    </script>
    % endif
</%def>

<div id="content-body">
    <div id="${post.id}" class="post" style="cursor:default;">
        <img class="post-photo" src="${request.route_path('account_photo', username=post.author.username)}">
        <div class="post-main">
            <p class="post-title">${post.title}</p>
            <div class="post-content">
            % if is_image_gallery():
            ${image_gallery()}
            % else:
            ${post.content|n}
            % endif
            </div>
            
            <div class="tags-viewer ${'hidden' if len(post.tags) == 0 else ''}">
                <span class="tags-title">태그 : </span>
                <span class="tags-content">
                % for tag in post.tags:
                    <a href="${request.route_path('search_tag', tag=tag)}">${tag}</a>,
                % else:
                    &nbsp;
                % endfor
                </span>
            </div>
            <div class="tags-editor hidden">
                <span class="tags-title">태그 : </span>
                <div class="tags-content">
                    <input type=text class="tags-input" name="tags-input">
                    <p> 태그이름을 컴마(,)로 구분해서 입력하세요.</p>
                </div>
            </div>
            <div class="post-info">
                <a class="post-user" href="${request.route_path('account_main', username=post.author.username)}">
                    <span>${post.author}</span>
                </a>
                <span class="post-time">· ${get_time_ago(post.published)}</span>
                | <span class="post-tools">
                    <a class="tags-button" href="javascript:doEditTag('${post.id}')">태그달기</a>
                    ·<a class="comment-button" href="javascript:doAddComment('${post.id}')">댓글달기</a>
                    % if post.author.username == authenticated_userid(request): 
                    % if not is_image_gallery():
                    ·<a class="post-edit" href="${request.route_path('blog_edit', id=post.id)}">편집</a>
                    % endif
                    ·<a class="post-remove" href="javascript:doDelete('${post.id}')">삭제</a>
                    % endif
                </span>
            </div>
            <div class="post-comments">
                % if comments_len > 3:
                <div class="comment-hide comment">
                    <img width="16" height="16" src="/static/images/comment.png">
                    &nbsp;<a class="comment-show" href="javascript:doShowComment('${post.id}')">${comments_len}개의 댓글 모두 보기</a>
                </div>
                % endif
                % for comment in post.comments:
                <div id="${comment.id}" class="comment ${'hidden' if comments_len > 3 and comments_len - loop.index > 2 else ''}">
                    <a class="photo-id" href="${request.route_path('account_main', username=comment.author.username)}">
                        <img src="${request.route_path('account_photo', username=comment.author.username)}">
                    </a>
                    <div class="body">
                        <a class="cuser" href="${request.route_path('account_main', username=comment.author.username)}">
                            ${comment.author.name}
                        </a>
                        <span class="comment-content">
                            ${comment.content|n}
                        </span>
                        <div class="cinfo">
                            <span class="comment-time">${get_time_ago(comment.posted)}</span>
                            <span class="comment-tools">
                                % if authenticated_userid(request) == comment.author.username:
                                | <a class="comment-remove" href="javascript:doDeleteComment('${post.id}', '${comment.id}')">삭제</a>
                                % endif
                            </span>
                        </div>
                    </div>
                </div>
                % endfor
            </div><!-- comments -->
            <form accept-charset="UTF-8" action="${request.route_path('blog_comment_add', bid=post.id)}"
                  id="new-comment" class="comment-new hidden" method="post">
                <div class="photo-id">
                    <img src="${request.route_path('account_photo', username=authenticated_userid(request))}">
                </div>
                <div class="comment-form">
                    <textarea name="comment" tabindex="1" class="comment-input"></textarea>
                    <button type="submit" id="add-comment" style="display:none" class="classy primary form-actions" tabindex="2">
                        <span>Comment</span>
                    </button>
                </div>
            </form>
            <div id="comment-id" class="comment hidden">
                <a class="photo-id" href="${request.route_path('account_main', username=authenticated_userid(request))}">
                    <img src="${request.route_path('account_photo', username=authenticated_userid(request))}">
                </a>
                <div class="body">
                    <a class="cuser" href="${request.route_path('account_main', username=authenticated_userid(request))}">
                        ${User.by_username(authenticated_userid(request)).name}
                    </a>
                    <span class="comment-content"></span>
                    <div class="cinfo">
                        <span class="comment-time">${get_time_ago(datetime.now())}</span>
                        <span class="comment-tools">
                            | <a class="comment-remove" href="">삭제</a>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<link rel="stylesheet" href="/static/stylesheets/blog.css" media="screen" type="text/css" />
<script>
function doDelete(id) {
    if (confirm("정말 삭제하시겠습니까?")) {
        var url = "/blog/" + id + "/remove";
        $.post(url, function() {
            $(location).prop("href", "/blog/list");
        }, "json");
    }
}
function doSaveTag(id) {
    var url = "/blog/" + id + "/tag_edit";
    $.post(url, {"tags": $("#" + id + " .tags-input").val()}, function(tags) {
        $("#" + id + " .tags-viewer .tags-content").html('');
        $(tags['tags']).each(function(index, value) {
            $("#" + id + " .tags-viewer .tags-content").append("<a href='/search/tag/" + value + "'>" + value + "</a>, ")
        });
        doCancelTag(id);
    }, "json");
}
function doEditTag(id) {
    var tags = ''
    $("#" + id + " .tags-viewer a").each(function() {
        tags += $(this).html().trim() + ', '
    });
    $("#" + id + " .tags-input").val(tags);
    $("#" + id + " .tags-viewer").hide();
    $("#" + id + " .tags-editor").show();
    $("#" + id + " .tags-input").focus();
}
function doCancelTag(id) {
    $("#" + id + " .tags-editor").hide();
    if ($("#" + id + " .tags-viewer a").size() > 0) 
        $("#" + id + " .tags-viewer").show();
    $("#" + id + " .tags-input").val("");
}
function doShowComment(id) {
    $("#" + id + " .comment").show();
    $("#" + id + " .comment-hide").hide();
}
function doDeleteComment(post_id, comment_id) {
    if (confirm("삭제하시겠습니까?")) {
        var url = "/blog/" + post_id + "/comment/del/" + comment_id;
        $.post(url, function() {
            $("#" + comment_id).remove();
        }, "json");
    }
}
function doAddComment(id) {
    $("#" + id + " .comment-new").show();
    $("#" + id + " .comment-input").focus();
}
function doSaveComment(id) {
    var url = "/blog/" + id + "/comment/add";
    var data = $("#" + id + " .comment-input").val();

    $.post(url, {"comment":data}, function(data) {
        var comment = $("#comment-id").clone();
        comment.prop("id", data.cid);
        comment.find(".comment-content").html(data.content);
        comment.find(".comment-remove").prop("href", "javascript:doDeleteComment('" + data.bid + "', '" + data.cid + "')"); 
        comment.appendTo("#" + data.bid + " .post-comments");
        $("#" + data.cid).show();
    }, "json");
    doCancelComment(id)
}
function doCancelComment(id) {
    $("#" + id + " .comment-new").hide();
    $("#" + id + " .comment-button").show();
    $("#" + id + " .comment-input").val("");
}
$(".tags-input").keydown(function(event) {
    if (event.which == 13) {
        doSaveTag($(this).parents(".post").prop("id"));
    }
    if (event.which == 27) {
        doCancelTag($(this).parents(".post").prop("id"));
    }
});
function doResizeTextArea(e) {
    $(this).height($(this).get(0).scrollHeight-4);
}
$(".comment-input").keyup(doResizeTextArea); 
$(".comment-input").keydown(function(event) {
    if (event.which == 13) {
        doSaveComment($(this).parents(".post").prop("id"));
    }
    if (event.which == 27) {
        doCancelComment($(this).parents(".post").prop("id"));
    }
});
$(document).ready(function() {
    //setTimeout('$(window).resize()', 100);
});
</script>