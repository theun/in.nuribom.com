<% 
from pyramid.security import authenticated_userid
from myproject.models import User, Category
from mongoengine import Q
from myproject.blog import AlarmMessage, get_time_ago

if authenticated_userid(request):
    login = User.by_username(authenticated_userid(request)) 
    my_category = Category.objects(Q(owner=login) | Q(members=login) | Q(public=True))  
else:
    login = None
%>

<!DOCTYPE html>
<html lang="ko">
    <head>
        <meta charset='utf-8'>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>누리인</title>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    
        <meta content="authenticity_token" name="csrf-param" />
        <meta content="oQWaFH1CgxJ/p5uR/osG5fSURVtY4GrwLLTb+S8SLM4=" name="csrf-token" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=2, user-scalable=yes" />
        
    	<link rel="stylesheet" href="/static/jquery-ui/css/ui-lightness/jquery-ui-1.8.18.custom.css" media="screen" type="text/css" />
        <link rel="stylesheet" href="/static/daumeditor/css/content_wysiwyg.css" type="text/css">
        <link rel="stylesheet" href="/static/daumeditor/css/content_view.css" type="text/css">
        <link rel="stylesheet" href="/static/stylesheets/nurin.css" media="screen" type="text/css" />
        <link rel="stylesheet" href="/static/stylesheets/blog.css" media="screen" type="text/css" />
        
        <script src="${request.static_url('myproject:static/jquery-ui/js/jquery-1.7.1.min.js')}"></script>
        <script src="${request.static_url('myproject:static/jquery-ui/js/jquery-ui-1.8.18.custom.min.js')}"></script>
        <script src="${request.static_url('myproject:static/javascripts/jquery.ui.datepicker-ko.js')}"></script>
    </head>

    <body>
        <div id="wrapper">
            <div class="container">
                <header class="nurin-header">
                    <a href="/" title="함께하는 누리봄 공간 - 누리인">
                        <img src="/static/images/nurin.png" height="60" />
                    </a>
                </header>
                <nav class="topbar">
                    <div class="mnav">
                        <button class="catToggle" title="메뉴">메뉴</button>
                    </div>
                    <div class="topsearch ">
                        <form accept-charset="UTF-8" action="${request.route_path('search_all')}" id="top_search_form" name="top_search" method="get">
                            <div class="search placeholder-field js-placeholder-field">
                                <input type="text" class="search my_repos_autocompleter" id="global-search-field" name="q" results="5" spellcheck="false" autocomplete="off" data-autocomplete="my-repos-autocomplete" placeholder="검색...">
                                <span class="mini-icon mini-icon-search-input"></span>
                            </div>
                            <input type="submit" value="" style="display:none">
                        </form>
                    </div><!-- topsearch -->
                    <div class="userbox">
                    % if login: 
                        <div class="user-info">
                            <a href="${request.route_path('account_main', username=login.username)}" title="내글" class="photo">
                                <img height="20" src="${request.route_path('account_photo', username=login.username)}">
                            </a>
                            <a href="${request.route_path('account_main', username=login.username)}" title="내글" class="name">
                                ${login.name}
                            </a>
                            <a href="#" class="alarm-button" title="알림">
                                <div class="alarm">
                                    <div style="position:relative; top:-1px;">${login.get_new_alarms()}</div>
                                </div>
                            </a>
                        </div>
                        <div class="user-links">
                            <a href="${request.route_path('account_info', username=login.username, category='basic')}">
                                <img src="/static/images/userinfo.png" title="개인정보">
                		    </a>
                            <a href="${request.route_path('logout')}">
                                <img src="/static/images/logout.png" title="로그아웃">
                            </a>
                        </div>
                    % else:
                        <div class="top-nav">
                            <img width="16" height="16" src="/static/images/login.png" title="로그인">
                            <a href="/login">로그인</a>
                        </div>
                    % endif
                    </div><!-- userbox -->
                </nav>

                <div class="body">
                    % if login:
                    <nav class="alarm-menu">
                    % for alarm in login.alarms[::-1]:
                        <div class="alarm-item ${'alarm-checked' if alarm.checked else ''}">
                            <a href="${request.route_path('alarm_view', id=alarm.id)}">${alarm.text|n}</a>
                            <div class="meta">${get_time_ago(alarm.created)}</div>
                        </div>
                    % endfor
                    </nav>
                    % endif
                    <section id="content" class="content">
                    ${next.body()}
                    </section>
        
                    <nav class="popup-menu">
                    </nav>
                    <nav class="side-menu">
                        <div id="menu-fav" class="mainmenu mainmenu-on">
                            <h2>즐겨찾기</h2>
                            <ol>
                                <li id="menu-fav-news">
                                    <img src="/static/images/newsfeed.png">
                                    <a href="${request.route_path('blog_list')}">새소식</a>
                                </li>
                                <li id="menu-fav-teams">
                                    <img src="/static/images/organization.png">
                                    <a href="${request.route_path('team')}">조직도</a>
                                </li>
                                <li id="menu-fav-account">
                                    <img src="/static/images/addressbook.png">
                                    <a href="${request.route_path('employees')}">비상연락망</a>
                                </li>
                            </ol>
                        </div>
                        % if login:
                        <div id="menu-group" class="mainmenu mainmenu-on">
                            <h2>그룹</h2>
                            <ol>
                                % for group in my_category:
                                <li id="menu-group-${group.id}">
                                    % if group.public:
                                    <img src="/static/images/group.png">
                                    % else:
                                    <img src="/static/images/private.png">
                                    % endif
                                    <a href="${request.route_path('group_list', id=group.id)}">${group.name}</a>
                                </li>
                                % endfor
                                <li id="menu-group-add">
                                    <img src="/static/images/save.png">
                                    <a id="add-group" href="javascript:doOpenGroupDialog()">그룹 만들기...</a>
                                </li>
                            </ol>
                        </div>
                        % if ('group:admin' in login.groups or 'admin:*' in login.permissions):
                        <div id="admin-menu" class="mainmenu mainmenu-on">
                            <h2>관리자메뉴</h2>
                            <ol>
                                <li id="menu-admin-account">
                                    <img src="/static/images/config.png">
                                    <a href="${request.route_path('admin_account')}">계정관리</a>
                                </li>
                                <li id="menu-admin-team">
                                    <img src="/static/images/config.png">
                                    <a href="${request.route_path('admin_team')}">조직관리</a>
                                </li>
                                <li id="menu-admin-perm">
                                    <img src="/static/images/config.png">
                                    <a href="${request.route_path('admin_permission')}">권한관리</a>
                                </li>
                                <li id="menu-admin-group">
                                    <img src="/static/images/config.png">
                                    <a href="${request.route_path('admin_group')}">권한그룹관리</a>
                                </li>
                                <li id="menu-admin-blog">
                                    <img src="/static/images/config.png">
                                    <a href="${request.route_path('admin_blog')}">블로그관리</a>
                                </li>
                            </ol>
                        </div>
                        % endif
                        % endif
                    </nav>
        
                    <!-- ui-dialog -->
                    <div id="dialog" title="Information">
                        <p id="message"></p>
                    </div>
                    <div id="dialog-form" title="그룹 만들기...">
                        <p class="validateTips"></p>
            
                        <form>
                        <style>
                            .ui-dialog .ui-state-error { padding: .3em; }
                            .validateTips { border: 1px solid transparent; padding: 0.3em; }
                        </style>
                        <fieldset style="padding:0; border:0; margin-top:10px;">
                            <label for="name" style="display:block;">그룹이름</label>
                            <input type="text" name="name" id="name" class="text ui-widget-content ui-corner-all" 
                                   style="display:block;margin-bottom:12px; width:95%; padding: .4em;" />
                            <label for="private">비공개</label>
                            <input type="checkbox" name="private" id="private" checked="checked" class="checkbox ui-widget-content ui-corner-all" />
                        </fieldset>
                        </form>
                    </div>
                
                    <div style="position: absolute; text-align: left; display: none; z-index: 100;" id="auto-completer">
                    </div>
                </div><!-- body_wrap -->

                <footer class="footer">
                    <p>
                        <a target="_blank" href="http://www.nuribom.com/">Nuribom Corp.</a>
                        All Rights Reversed.
                    </p>
                </footer>
            </div><!-- container -->

            <script>
                String.prototype.format = function () {
                    var args = arguments;
                    return this.replace(/\{(\d+)\}/g, function (match, number) {
                        return typeof args[number] !== 'undefined' 
                            ? args[number]
                            : match;
                    });
                };
        
                $(document).ready(function() {
                    $search = $("#global-search-field")
                    $(".popup-menu").append($(".side-menu").html())
                    $("html").click(doHideMenu);
                });
        
                $(function() {
                    // a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
                    $( "#dialog:ui-dialog" ).dialog( "destroy" );
                    
                    var name = $( "#name" ),
                        allFields = $( [] ).add( name ),
                        tips = $( ".validateTips" );
            
                    function updateTips( t ) {
                        tips
                            .text( t )
                            .addClass( "ui-state-highlight" );
                        setTimeout(function() {
                            tips.removeClass( "ui-state-highlight", 1500 );
                        }, 500 );
                    }
            
                    function checkLength( o, n ) {
                        if ( o.val().trim().length == 0 ) {
                            o.addClass( "ui-state-error" );
                            updateTips( n + "을 입력하세요.");
                            return false;
                        } else {
                            return true;
                        }
                    }
            
                    $( "#dialog-form" ).dialog({
                        autoOpen: false,
                        height: 240,
                        width: 300,
                        modal: true,
                        buttons: {
                            OK: function() {
                                var bValid = true;
                                allFields.removeClass( "ui-state-error" );
            
                                bValid = bValid && checkLength( name, "그룹이름" );
            
                                if ( bValid ) {
                                    var json_data = {};
                                    json_data['name'] = name.val().trim();
                                    json_data['private'] = ($("#private:checked").length == 1);
                                    $.post("${request.route_path('group_add')}", json_data, function(result) {
                                        $( location ).attr("href", "/blog/group/list/" + result.id);
                                    }, "json");
                                }
                            },
                            Cancel: function() {
                                $( this ).dialog( "close" );
                            }
                        },
                        close: function() {
                            allFields.val( "" ).removeClass( "ui-state-error" );
                        }
                    });
                });
                $("#name").keydown(function(event) {
                    if (event.which == 13) {
                        event.preventDefault();
                    }
                });
        
                var search = {
                    exec: function(prefix) {
                        this.prefix = prefix;
                        if (prefix) {
                            var url = "${request.route_path('search_prefix')}" + "?" + this.kind + "=" + prefix;
                            $.post(url, function(result) {
                                var $box = $("#auto-completer")
                                var $focus = $("*:focus");
                                var offset = $focus.offset();
                                
                                $box.html("");
                                for (var i = 0, len = result.length; i < len && i < 10; i++) { 
                                    $box.append( 
                                        "<li>" + 
                                        result[i] +
                                        "</li>" );
                                }
                                $box.css("width", $focus.outerWidth()); 
                                $box.show();
                                $box.offset( {top: offset.top + $focus.outerHeight() + 2, left: offset.left} );
                                $("#auto-completer li").click(function(){
                                    var $search = $("#global-search-field");  
                                    $search.val($(this).html());
                                    $search.focus();
                                    $box.hide();
                                });
                                $("#auto-completer li").mouseenter(function(){
                                    $(this).addClass('cursor');
                                });
                                $("#auto-completer li").mouseleave(function(){
                                    $(this).removeClass('cursor');
                                });
                            }, "json");
                        }
                        else {
                            $("#auto-completer").hide();
                        }
                    },
                    setup: function(kind, prefix) {
                        this.cancel();
                        if (this.prefix != prefix) {
                            var self = this;
                            this.kind = kind;
                            this.timeoutID = window.setTimeout(function(key) {self.exec(key);}, 500, prefix);
                        }
                    },
                    cancel: function() {
                        if (typeof this.timeoutID == "number") {
                            window.clearTimeout(this.timeoutID);
                            delete this.timeoutID;
                        }
                    }
                };
        
                $("#global-search-field, .search-input").keyup(function(event) {
                    var $box = $("#auto-completer");
                    var $focus = $("*:focus");
                    
                    if ($box.is(":visible")) {
                        if (event.which == 27) { // ESC
                            $box.hide();
                            return true;
                        }
                        else if (event.which == 40) { // Down
                            var $cursor = $box.find('.cursor');
                            if ($cursor.length == 0) {
                                $cursor = $box.find("li").eq(0).addClass('cursor');
                                $focus.val($cursor.html());
                            } else {
                                $cursor.removeClass('cursor');
                                if ($cursor.next().length) {
                                    $cursor = $cursor.next().addClass('cursor');
                                    $focus.val($cursor.html());
                                }
                            }
                            return true;
                        }
                        else if (event.which == 38) { // Up
                            var $cursor = $box.find('.cursor');
                            if ($cursor.length == 0) {
                                $cursor = $box.find("li").eq(-1).addClass('cursor');
                                $focus.val($cursor.html());
                            } else {
                                $cursor.removeClass('cursor');
                                if ($cursor.prev().length) {
                                    $cursor = $cursor.prev().addClass('cursor');
                                    $focus.val($cursor.html());
                                }
                            }
                            return true;
                        }
                    }
                    if ($(this).prop('id') == 'global-search-field') {
                        search.setup('keyword', $(this).val().trim());
                    }
                    else {
                        search.setup('user', $(this).val().trim());
                    }
                });
                function doOpenGroupDialog() {
                    doHideMenu();
                    $( "#dialog-form" ).dialog( "open" );
                }
                
                function doHideMenu(e) {
                    $menu = $(".popup-menu"); 
                    if ($menu.is(":visible")) {
                        $menu.hide();
                    }
                    $menu = $(".alarm-menu");
                    if ($menu.is(":visible")) {
                        $menu.hide();
                    }
                }
                $(".catToggle").click(function(e) {
                    e.stopPropagation();
                    $menu = $(".popup-menu");
                    if ($menu.is(":visible")) {
                        $menu.hide();
                    } else {
                        var $body = $(".body");
                        if ($body.outerHeight() < $menu.outerHeight()) {
                            $body.css("height", $menu.outerHeight());
                        }
                        $menu.show();
                    }
                });
                $(".alarm-button").click(function(e) {
                    e.stopPropagation();
                    $menu = $(".alarm-menu");
                    if ($menu.is(":visible") || $(".alarm-menu .alarm-item").length == 0) {
                        $menu.hide();
                    } else {
                        var $body = $(".body");
                        if ($body.outerHeight() < $menu.outerHeight()) {
                            $body.css("height", $menu.outerHeight());
                        }
                        $menu.show();
                        $menu.offset({left: $(this).offset().left - $menu.outerWidth()});
                    }
                });
                $(".alarm-item").click(function(e) {
                    location.href = $(this).find("a")[0].href
                });
            </script>
        </div><!-- wrapper -->
    </body>
</html>
