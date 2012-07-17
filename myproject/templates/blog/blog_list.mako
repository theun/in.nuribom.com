# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>

<%
from myproject.views import log, image_thumbnail_info
from myproject.blog import get_time_ago
from myproject.models import User
from datetime import datetime
from pyramid.security import authenticated_userid

def is_image_gallery(post):
    return post.content.strip() == ""

page = 0
numPage = 3
if 'page' in request.params:
    page = int(request.params['page']) - 1

me = User.by_username(authenticated_userid(request))
%>

<%def name="image_gallery(post)">
    <p>${len(post.images)}장의 사진이 있습니다. <a href="${request.route_path('blog_view', id=post.id)}"><strong>(더보기...)</strong></a></p> 
    <div id="gallery" class="clearfix">
        % for url in post.images:
        % if loop.index < 3:
        <% info = image_thumbnail_info(url.split('/')[-1]) %>
        <div class="box">
            <p>
                <img width="${info['width']}" height="${info['height']}" src="${url + '/thumbnail'}" alt="${info['name']}" />
            </p>
        </div>
        % endif
        % endfor
    </div>
</%def>

% if request.current_route_path().split('/')[1] != 'search': 
<div id="top-toolbar">
    % if group:
        <h3>${group.name}</h3>
        <a id="blog-new" href="${request.route_path('group_post', id=group.id)}"
         title="${group.name}에 새글을 작성합니다">새글</a>
        % if group.owner.username == authenticated_userid(request):
            <a href="javascript:doGroupDelete()"
             title="${group.name} 그룹을 삭제합니다">그룹삭제</a>
            % if not group.public:
            <a id="group-member" href="#"
             title="${group.name} 그룹에 멤버를 추가하거나 삭제합니다">
                <span>멤버 &#9660;</span>
            </a>
            <div id="group-member-submenu" class="hidden">
                <div id="search-wrap">
                    <input type="text" class="search-input" placeholder="+ 멤버추가..." />
                </div>
                <ul>
                    <li class="owner"><span id="${group.owner.username}">${group.owner.name}</span></li>
                    % for m in group.members:
                    <li><a id="${m.username}" class="group-member-del" href="#" title="삭제">${m.name}</a></li> 
                    % endfor
                </ul>
                <button>저장</button>
            </div>
            % endif
        % endif
    % else:
        <h3>새소식</h3>
        <a id="blog-new" href="${request.route_path('blog_post')}"
         title="새소식에 새글을 작성합니다">새글</a>
        <a id="album-new" href="${request.route_path('image_post')}"
         title="새소식에 사진을 추가합니다">사진</a>
    % endif
    <div id="description">
    </div>
</div>
% endif

<div id="content-body">
    <div id="post-list">
        % for post in posts[page*numPage:(page+1)*numPage]:
        <% 
            comments_len = len(post.comments)
            likes = post.likes[:]
            if me in post.likes:
                likes.remove(me)
            likes_len = len(likes)
        %>
        <div id="${post.id}" class="post clearfix" style="cursor:default;">
            <img class="post-photo" src="${request.route_path('account_photo', username=post.author.username)}">
            <div class="post-main">
                <p class="post-title"><a href="${request.route_path('blog_view', id=post.id)}">${post.title}</a></p>
                <div class="post-content tx-content-container">
                % if is_image_gallery(post):
                ${image_gallery(post)}
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
                    <img class="post-photo" src="${request.route_path('account_photo', username=post.author.username)}">
                    <a class="post-user" href="${request.route_path('account_main', username=post.author.username)}">
                        <span>${post.author}</span>
                    </a>
                    <span class="post-time">· ${get_time_ago(post.modified)}</span>
                    | 
                    <span class="post-tools">
                        % if authenticated_userid(request) in [u.username for u in post.likes]:
                        <a class="like-button" href="javascript:doLikeIt('${post.id}')">좋아요 취소</a>
                        % else:
                        <a class="like-button" href="javascript:doLikeIt('${post.id}')">좋아요</a>
                        % endif
                        ·<a class="tags-button" href="javascript:doEditTag('${post.id}')">태그달기</a>
                        ·<a class="comment-button" href="javascript:doAddComment('${post.id}')">댓글달기</a>
                        % if post.author.username == authenticated_userid(request) or authenticated_userid(request) == 'admin':
                        % if not is_image_gallery(post):
                        ·<a class="post-edit" href="${request.route_path('blog_edit', id=post.id)}">편집</a>
                        %endif
                        ·<a class="post-remove" href="javascript:doDelete('${post.id}')">삭제</a>
                        % endif
                    </span>
                </div>
                % if likes_len > 0:
                <div class="post-likes">
                    <img src="/static/images/love.png" title="좋아요">
                    % for like in likes:
                    <a class="cuser" href="${request.route_path('account_main', username=like.username)}"
                        >${like.name}</a>님${u'이 좋아합니다.' if loop.last else ','}
                    % endfor
                </div>
                % endif
                <div class="post-comments">
                    % if comments_len > 3:
                    <div class="comment-hide comment">
                        <img width="16" height="16" src="/static/images/comment.png">
                        &nbsp;<a class="comment-show" href="javascript:doShowComment('${post.id}')">${comments_len}개의 댓글 모두 보기</a>
                    </div>
                    % endif
                    % for comment in post.comments:
                    <section id="${comment.id}" class="comment ${'hidden' if comments_len > 3 and comments_len - loop.index > 2 else ''}">
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
                    </section>
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
            </div>
        </div>
        % endfor
        <div id="comment-id" class="comment hidden">
            <a class="photo-id" href="${request.route_path('account_main', username=authenticated_userid(request))}">
                <img src="${request.route_path('account_photo', username=authenticated_userid(request))}">
            </a>
            <div class="body">
                <a class="cuser" href="${request.route_path('account_main', username=authenticated_userid(request))}">
                    ${me.name}
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
    <nav id="page_nav">
        % if group:
        <a href="${request.route_path('group_list', id=group.id) + '?page=2'}"></a>
        % else:
        <a href="${request.route_path('blog_list') + '?page=2'}"></a>
        % endif
    </nav>
    % if len(posts) > page * numPage:
    <div class="load-more">
        더보기...
    </div>
    % endif
</div>

<script src="/static/javascripts/jquery.isotope.min.js"></script>
<script src="/static/javascripts/jquery.infinitescroll.js"></script>

<script>
    function doDelete(id) {
        if (confirm("정말 삭제하시겠습니까?")) {
            $.post("/blog/"+id+"/remove", function(){location.reload();});
        }
    }
    % if group and group.owner.username == authenticated_userid(request):
    function doGroupDelete() {
        if (confirm("그룹을 삭제하시면 그룹의 모든 글도 삭제됩니다.\n정말 삭제하시겠습니까?")) {
            $.post("${request.route_path('group_del', id=group.id)}", function() {
                location.href = "/";
            });
        }
    }
    % if not group.public:
    $(function() {
        $("#group-member-submenu button").click(function(event) {
            var data = [];
            $(this).parent().find('a').each(function() {
                data.push($(this).prop('id'));
            });
            $.post("${request.route_path('group_edit', id=group.id)}", {'members': data.join()}, function() {
                location.reload();
            }, "json");
        });
        $(".search-input").keydown(function(event) {
            if (event.which == 13) {
                $.post("/search/user/" + $(".search-input").val(), function(result) {
                    $menu = $("#group-member-submenu ul"); 
                    if ('username' in result && $menu.find('#' + result.username).length == 0) {
                        $menu.append( 
                            "<li>" + 
                            "<a id='" + result.username + "' class='group-member-del' href='#' title='삭제'>" +
                            result.name +
                            "</a>" + 
                            "</li>" );
                        $(".group-member-del").click(function(event) {
                            $(event.target).parent().remove();
                            $(".search-input").focus();
                            return false;
                        });
                    }
                }, "json");
                $(this).val("");
            }
            if (event.which == 27) {
                doHideSubmenu(event, true);
            }
        });
        function doMemberEdit(e) {
            e.stopPropagation();
            $menu = $("#group-member-submenu"); 
            $button = $("#group-member");
            if ($menu.is(":visible")) {
                $menu.hide();
            } else {
                $menu.show();
                $menu.offset({left: $button.offset().left});
                $(".search-input").focus();
            }
        }
        function doHideSubmenu(e, force) {
            if (force == true || $(e.target).parents("#group-member-submenu").length == 0) {
                if ($("#group-member-submenu").is(":visible")) {
                    $(".search-input").val("");
                    $("#group-member-submenu").hide();
                    if ($("#auto-completer").length)
                        $("#auto-completer").hide();
                }
            }
        }
        $("#group-member").click(doMemberEdit);
        $("html").click(doHideSubmenu);
    });
    % endif
    % endif
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
        var data = $("#" + id + " .comment-input").val().trim();

        if (data) {
            $.post(url, {"comment":data}, function(data) {
                var comment = $("#comment-id").clone();
                comment.prop("id", data.cid);
                comment.find(".comment-content").html(data.content);
                comment.find(".comment-remove").prop("href", "javascript:doDeleteComment('" + data.bid + "', '" + data.cid + "')"); 
                comment.appendTo("#" + data.bid + " .post-comments");
                $("#" + data.cid).show();
            }, "json");
        }
        doCancelComment(id)
    }
    function doCancelComment(id) {
        $("#" + id + " .comment-new").hide();
        $("#" + id + " .comment-button").show();
        $("#" + id + " .comment-input").val("");
    }
    function doResizeTextArea(e) {
        $(this).height($(this).get(0).scrollHeight-4);
    }
    function doEventHandler() {
        $(".tags-input").keydown(function(event) {
            if (event.which == 13) {
                doSaveTag($(this).parents(".post").prop("id"));
            }
            if (event.which == 27) {
                doCancelTag($(this).parents(".post").prop("id"));
            }
        });
        $(".comment-input").keyup(doResizeTextArea); 
        $(".comment-input").keydown(function(event) {
            if (event.which == 13) {
                doSaveComment($(this).parents(".post").prop("id"));
            }
            if (event.which == 27) {
                doCancelComment($(this).parents(".post").prop("id"));
            }
        });
    }
    function doLikeIt(id) {
        $.post('/blog/' + id + '/like_toggle', function(result) {
            $like = $('#' + id + ' .like-button');
            if (result.like) {
                $like.html('좋아요 취소');
            } else {
                $like.html('좋아요');
            }
        }, "json");
    }
    $('#post-list').infinitescroll({
        navSelector  : '#page_nav',    // selector for the paged navigation 
        nextSelector : '#page_nav a',  // selector for the NEXT link (to page 2)
        itemSelector : 'div.post',     // selector for all items you'll retrieve
        loading: {
            finishedMsg: '',
            img: '/static/images/busy.gif'
        }
    },
    function(arrayOfNewElems) {
        doEventHandler();
    });
    
    $('#post-list').infinitescroll('binding', 'unbind');
    $('.load-more').click(function(e) {
        console.log("load-more");
        e.preventDefault();
        $('#post-list').infinitescroll('retrieve');
    });
    
    function scroll() {
        if ($(document).height() - $(window).height() <= 50) {
            $('#post-list').infinitescroll('retrieve');
            setTimeout(scroll, 300);
        }
    }
    $(document).ready(function() {
        doEventHandler();
        setTimeout("scroll()", 100);
    });
</script>
