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
numPage = 6

me = User.by_username(authenticated_userid(request))
user = request.matchdict.get('username', '')
if user:
    user = User.by_username(user)
    blog_title = user.name
else:
    blog_title = u"새소식"
%>

<%def name="image_gallery(post)">
    <p>
        ${len(post.images)}장의 사진이 있습니다. 
        <a href="${request.route_path('blog_view', id=post.id)}"><strong>(더보기...)</strong></a>
    </p> 
    <div id="gallery" class="clearfix">
        % for url in post.images:
        % if loop.index < 3:
        <% info = image_thumbnail_info(url.split('/')[-1]) %>
        <div class="box">
            <img width="${info['width']}" height="${info['height']}" src="${url + '/thumbnail'}" alt="${info['name']}" />
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
    <nav id="page_nav">
        % if group:
        <a href="${request.route_path('group_list', id=group.id) + '?page=2'}"></a>
        % else:
        <a href="${request.route_path('blog_list') + '?page=2'}"></a>
        % endif
    </nav>
</div>

<link rel="stylesheet" href="/static/stylesheets/blog.css" media="screen" type="text/css" />
<%include file="blog.html" />

<script src="/static/javascripts/jquery.isotope.js"></script>
<script src="/static/javascripts/jquery.infinitescroll.js"></script>

<script>
 // modified Isotope methods for gutters in masonry
  $.Isotope.prototype._getMasonryGutterColumns = function() {
    var gutter = this.options.masonry && this.options.masonry.gutterWidth || 0;
        containerWidth = this.element.width();
  
    this.masonry.columnWidth = this.options.masonry && this.options.masonry.columnWidth ||
                  // or use the size of the first item
                  this.$filteredAtoms.outerWidth(true) ||
                  // if there's no items, use size of container
                  containerWidth;

    this.masonry.columnWidth += gutter;

    this.masonry.cols = Math.floor( ( containerWidth + gutter ) / this.masonry.columnWidth );
    this.masonry.cols = Math.max( this.masonry.cols, 1 );
  };

  $.Isotope.prototype._masonryReset = function() {
    // layout-specific props
    this.masonry = {};
    // FIXME shouldn't have to call this again
    this._getMasonryGutterColumns();
    var i = this.masonry.cols;
    this.masonry.colYs = [];
    while (i--) {
      this.masonry.colYs.push( 0 );
    }
  };

  $.Isotope.prototype._masonryResizeChanged = function() {
    var prevSegments = this.masonry.cols;
    // update cols/rows
    this._getMasonryGutterColumns();
    // return if updated cols/rows is not equal to previous
    return ( this.masonry.cols !== prevSegments );
  };

    var refresh = function() {
        $container = $('#post-list');
        postWidth = $(".post").outerWidth();
        gutterWidth = (postWidth < $container.width() ? $container.width() - postWidth * 2 : 0);
        $container.isotope({
            itemSelector : '.post',
            masonry: { columnWidth : postWidth, gutterWidth: gutterWidth },
        });
        $container.infinitescroll({
            navSelector  : '#page_nav',    // selector for the paged navigation 
            nextSelector : '#page_nav a',  // selector for the NEXT link (to page 2)
            itemSelector : '.post',     // selector for all items you'll retrieve
            loading: {
                finishedMsg: '마지막 페이지',
                img: '/static/images/busy.gif'
            }
        },
        function(newElements) {
            $container.isotope(
                'appended', $(newElements)
            );
            _.delay(function() {
                $container.isotope({masonry: {columnWidth : postWidth, gutterWidth: gutterWidth}});
            }, 400);
        });
        $(window).smartresize(function() {
            postWidth = $(".post").outerWidth();
            gutterWidth = (postWidth < $container.width() ? $container.width() - postWidth * 2 : 0);
            $container.isotope({masonry: {columnWidth : postWidth, gutterWidth: gutterWidth}});
        });
        _.delay(function() { $(window).resize(); }, 400);
    };
</script>

<script src="/static/javascripts/blog.js"></script>
<script>
    var app = new PostsView({ 
        model: new Posts(), 
        list: true 
    }); 
</script>