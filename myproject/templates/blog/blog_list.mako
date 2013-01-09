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

page = int(request.params.get('page', '1')) - 1
numPage = 3

me = User.by_username(authenticated_userid(request))
user = request.matchdict.get('username', '')
if user:
    user = User.by_username(user)
    blog_title = user.name
else:
    blog_title = u"새소식"
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
<div class="navbar">
    <div class="navbar-inner">
    % if group:
        % if group.owner.username == authenticated_userid(request):
        <a class="brand" id="group-name" href="#modalChangeGroupName" data-toggle="modal">${group.name}</a>
        % else:
        <a class="brand" id="group-name" href="#">${group.name}</a>
        % endif
        <ul class="nav">
            <li class="divider-vertical"></li>
            <li>
                <a id="blog-new" href="${request.route_path('group_post', id=group.id)}">새글</a>
            </li>
            % if group.owner.username == authenticated_userid(request):
            <li>
                <a href="javascript:doGroupDelete()">그룹삭제</a>
            </li>
            % if not group.public:
            <li>
                <a href="#modalEditGroupMember" data-toggle="modal">멤버관리</a>
            </li>
            % endif
            % endif
        </ul>
    % else:
        <a class="brand" href="#">${blog_title}</a>
        <ul class="nav">
            <li class="divider-vertical"></li>
            <li>
                <a id="blog-new" href="${request.route_path('blog_post')}"
                 title="새소식에 새글을 작성합니다">새글</a>
            </li>
            <li>
                <a id="album-new" href="${request.route_path('image_post')}"
                 title="새소식에 사진을 추가합니다">사진추가</a>
            </li>
        </ul>
    % endif
    </div>
</div>
% endif

% if group and group.owner.username == authenticated_userid(request):
<!-- 그룹 이름 바꾸기 -->
<div id="modalChangeGroupName" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="labelChangeGroupTitle" aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="labelChangeGroupTitle">그룹 이름 바꾸기</h3>
    </div>

    <div class="modal-body">
        <form action="javascript:doChangeGroupName()">
            <label>그룹이름</label>
            <input class="span6" type="text" name="input-group-name" id="input-group-name">
        </form>
    </div>
    <div class="modal-footer">
        <a href="#" class="btn" data-dismiss="modal" aria-hidden="true">취소</a>
        <a href="javascript:doChangeGroupName()" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">확인</a>
    </div>
</div>
<script>
    $('#modalChangeGroupName').on('shown', function () {
        input_name = $("#input-group-name");
        input_name.val($("#group-name").html());
        input_name.select();
    });
    function doChangeGroupName() {
        name = $("#input-group-name").val().trim();
        if (name && name != $("#group-name").html()) {
            $.post("${request.route_path('group_change_name', id=group.id)}", {'name': name}, function() {
                $("#group-name").html(name);
            });
        }
    }
</script>

% if not group.public:
<!-- 그룹 멤버 관리 -->
<div id="modalEditGroupMember" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="labelEditGroupMember" aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="labelEditGroupMember">그룹 멤버 관리</h3>
    </div>

    <div class="modal-body">
        <form class="input-append">
            <input type="text" id="input-user-name" placeholder="사용자검색..." />
        </form>
        <div id="modal-group-member-list">
        </div>
    </div>
    <div class="modal-footer">
        <a href="#" class="btn" data-dismiss="modal" aria-hidden="true">취소</a>
        <a href="javascript:doSaveGroupMember()" class="btn btn-primary">저장</a>
    </div>
</div>
<script>
    var isLoadingUsers = true;
    var $owner = $('<a class="btn btn-primary">${group.owner.name}</a>')
    var $member = $('<a class="btn" onclick="doDeleteGroupMember(this)"> <i class="icon-remove"></i></a>')
    var $list = $("#modal-group-member-list");
    
    /* 그룹 편집 모달이 보이기전 : 멤버 목록을 비운다 */
    $('#modalEditGroupMember').on('show', function() { $list.empty(); });
    
    /* 그룹 편비 모달이 보인 후 */
    $('#modalEditGroupMember').on('shown', function () {
    
        /* 사용자 목록 로딩 전이면 */    
        if (isLoadingUsers) {
            isLoadingUsers = false;
    
            /* 사용자 추가 입력상자의 자동완성(typeahead) 기능을 위해 사용자 이름 목록을 읽어들인다. */
            $.get("/user/list", function(data) {
                $("#input-user-name").typeahead({
                    source: data.users,
                    items: 4,
                    updater: doAddGroupMember,
                });
            }, "json");
        }
        
        /* 그룹 소유자를 추가한다. */
        $list.append($owner).append(' ')
        
        /* 그룹 멤버 이름들을 추가한다. */
        $.get("${request.route_path('group_members', id=group.id)}", function(data) {
            $.each(data.members, function(i, elem) {
                $list.append($member.clone().prepend(elem)).append(' ');
            }); 
        }, "json");
        
        /* 사용자 입력란을 지우고 입력 포커스를 위치시킨다 */
        $("#input-user-name").val("");
        $("#input-user-name").focus();
    });
    function doAddGroupMember(name) {
        var data = [];

        $("#input-user-name").val("");
        $("#modal-group-member-list").find('a').each(function() {
            data.push($(this).text().trim());
        });

        if (name && data.indexOf(name) < 0) {
            $list.append($member.clone().prepend(name)).append(' ');
        }
    }
    function doDeleteGroupMember(m) {
        $(m).remove();
    }
    function doSaveGroupMember() {
        var data = [];

        $("#modal-group-member-list").find('a').each(function(index, elem) {
            if (index > 0) {
                data.push($(elem).text().trim());
            }
        });
        $.post("${request.route_path('group_edit', id=group.id)}", {'members': data.join()}, function() {
            $("#modalEditGroupMember").modal('hide');
        }, "json");
    }
</script>
% endif
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
            <div class="post-inner">
                <img class="post-photo" src="${request.route_path('account_photo', username=post.author.username)}">
                <div class="post-main">
                    <p class="post-title"><a href="${request.route_path('blog_view', id=post.id)}">${post.title}</a></p>
                    <p class="post-meta">
                        <a class="post-user" href="${request.route_path('account_main', username=post.author.username)}">
                            <span>${post.author}</span>
                        </a>
                        <span class="post-time">· ${get_time_ago(post.modified)}</span>
                    </p>
                </div>
                <div class="post-content tx-content-container">
                    % if is_image_gallery(post):
                    ${image_gallery(post)}
                    % else:
                    ${post.content|n}
                    % endif
                </div>
            </div>
            <!-- 태그 기능 삭제
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
            -->
            <div class="post-menu navbar">
                <div class="navbar-inner">
                    <ul class="nav">
                        <li>
                            % if authenticated_userid(request) in [u.username for u in post.likes]:
                            <a class="like-button" href="javascript:doLikeIt('${post.id}')">
                                <i class="icon-remove"></i>
                                좋아요 취소
                            </a>
                            % else:
                            <a class="like-button" href="javascript:doLikeIt('${post.id}')">
                                <i class="icon-heart"></i>
                                좋아요
                            </a>
                            % endif
                        </li>
                        <!-- 태그 기능 삭제
                        <li class="divider-vertical"></li>
                        <li><a class="tags-button" href="javascript:doEditTag('${post.id}')">태그달기</a></li>
                        -->
                        <li class="divider-vertical"></li>
                        <li><a class="comment-button" href="javascript:doAddComment('${post.id}')">
                            <i class="icon-comment"></i>
                            댓글달기
                        </a></li>
                        % if post.author.username == authenticated_userid(request) or authenticated_userid(request) == 'admin':
                        <li class="divider-vertical"></li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                관리
                                <b class="caret"></b>
                            </a>
                            <ul class="dropdown-menu pull-right">
                                % if not is_image_gallery(post):
                                <li><a class="post-edit" href="${request.route_path('blog_edit', id=post.id)}">글수정</a></li>
                                %endif
                                <li><a class="post-remove" href="javascript:doDelete('${post.id}')">글삭제</a></li>
                                % endif
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="post-info clearfix">
                % if likes_len > 0:
                <div class="post-info-item">
                    <a href="javascript:doShowInfo('${post.id}')">
                        <i class="icon-heart"></i>
                        ${likes_len}명
                    </a>
                </div>
                % endif
                % if comments_len > 0:
                <div class="post-info-item">
                    <a href="javascript:doShowInfo('${post.id}')">
                        <i class="icon-comment"></i> 
                        ${comments_len}개
                    </a>
                </div> 
                % endif
            </div>
            <div class="post-likes post-hidden">
                <i class="icon-heart"></i>
                % for like in likes:
                <a class="cuser" href="${request.route_path('account_main', username=like.username)}">${like.name}</a><span class="comma">,</span>
                % endfor
                님이 좋아합니다.
            </div>
            <div class="post-comments">
                % for comment in post.comments:
                <section id="${comment.id}" class="comment post-hidden">
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
            <div class="post-inner post-comment-input">
                <img class="post-photo" src="${request.route_path('account_photo', username=authenticated_userid(request))}">
                <form accept-charset="UTF-8" action="${request.route_path('blog_comment_add', bid=post.id)}"
                      id="new-comment" class="comment-new" method="post">
                    <textarea name="comment" tabindex="1" rows="2" class="comment-input"></textarea>
                    <button type="submit" id="add-comment" class="hidden" tabindex="2"></button>
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

<link rel="stylesheet" href="/static/stylesheets/blog.css" media="screen" type="text/css" />
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
    % endif
    function doShowInfo(id) {
        $("#" + id + " .post-info").hide();
        $("#" + id + " .post-likes").show();
        $("#" + id + " .comment").show();
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
                $("#" + data.cid).removeClass('hidden');
            }, "json");
        }
        doCancelComment(id)
    }
    function doCancelComment(id) {
        $("#" + id + " .comment-input").val("");
    }
    function doEventHandler() {
        $(".comment-input").keydown(function(event) {
            if (event.which == 13) {
                doSaveComment($(this).parents(".post").prop("id"));
                event.preventDefault();
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
