<% 
from pyramid.security import authenticated_userid
from myproject.models import User, Category
from mongoengine import Q

if authenticated_userid(request):
    login = User.by_username(authenticated_userid(request)) 
    my_category = Category.objects(Q(owner=login) | Q(members=login) | Q(public=True))  
else:
    login = None
%>

<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>누리-인</title>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />

    <meta content="authenticity_token" name="csrf-param" />
    <meta content="oQWaFH1CgxJ/p5uR/osG5fSURVtY4GrwLLTb+S8SLM4=" name="csrf-token" />

	<link rel="stylesheet" href="/static/jquery-ui/css/ui-lightness/jquery-ui-1.8.18.custom.css" media="screen" type="text/css" />
	<link rel="stylesheet" href="/static/blueimp-jQuery-File-Upload-47bdcea/css/jquery.fileupload-ui.css">
    <link rel="stylesheet" href="/static/stylesheets/nurin.css" media="screen" type="text/css" />
    <link rel="stylesheet" href="/static/daumeditor/css/content_wysiwyg.css" type="text/css">
    <link rel="stylesheet" href="/static/daumeditor/css/content_view.css" type="text/css">

    <script src="${request.static_url('myproject:static/jquery-ui/js/jquery-1.7.1.min.js')}"></script>
    <script src="${request.static_url('myproject:static/jquery-ui/js/jquery-ui-1.8.18.custom.min.js')}"></script>
    <script src="${request.static_url('myproject:static/javascripts/jquery.ui.datepicker-ko.js')}"></script>
	<script src="${request.static_url('myproject:static/blueimp-jQuery-File-Upload-47bdcea/js/vendor/jquery.ui.widget.js')}"></script>
	<script src="${request.static_url('myproject:static/blueimp-jQuery-File-Upload-47bdcea/js/jquery.iframe-transport.js')}"></script>
	<script src="${request.static_url('myproject:static/blueimp-jQuery-File-Upload-47bdcea/js/jquery.fileupload.js')}"></script>
  </head>

  <body>
    <div id="wrapper">

      <div id="header"> 
        <div class="container">
          <a class="site-logo" href="/" title="누리봄">
            <img src="/static/logo.png" />
          </a>
          <div class="topsearch ">
            <form accept-charset="UTF-8" action="/search" id="top_search_form" method="get">
              <a href="/search" class="advanced-search tooltipped downwards" title="Advanced Search">
                  <img width="16" height="16" src="/static/images/busy.png" title="검색">
              </a>
              <div class="search placeholder-field js-placeholder-field">
                <input type="text" class="search my_repos_autocompleter" id="global-search-field" name="q" results="5" spellcheck="false" autocomplete="off" data-autocomplete="my-repos-autocomplete" placeholder="검색...">
                <input type="submit" value="Search" class="button">
                <span class="mini-icon mini-icon-search-input"></span>
              </div>
            </form>
          </div><!-- topsearch -->
          <div id="userbox">
	      % if login: 
            <div id="user-info">
              <a href="${request.route_path('account_main', username=login.username)}">
                <img height="20" src="${request.route_path('account_photo', username=login.username)}">
              </a>
              <a href="${request.route_path('account_main', username=login.username)}" class="name">
                ${login.name}
              </a>
            </div>
            <ul id="user-links">
			  <li>
			    <a href="${request.route_path('account_info', username=login.username, category='basic')}">
                  <img width="16" height="16" src="/static/images/userinfo.png" title="개인정보">
			    </a>
			  </li>
              <li>
                <a href="${request.route_path('logout')}">
                  <img width="16" height="16" src="/static/images/logout.png" title="로그아웃">
                </a>
              </li>
            </ul>
          % else:
            <ul class="top-nav">
              <li class="login">
                <img width="16" height="16" src="/static/images/login.png" title="로그인">
                <a href="/login">로그인</a>
              </li>
            </ul>
          % endif
          </div><!-- userbox -->
        </div>
      </div><!-- header -->
      <div id="body-wrap" class="container">
          <div id="menu-bar">
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
                        <img src="/static/images/group.png">
                        <a href="${request.route_path('blog_list')}?category=${group.name}">${group.name}</a>
                    </li>
                    % endfor
                    <li id="menu-group-add">
                        <img src="/static/images/save.png">
                        <a id="add-group" href="#modal-form">그룹 만들기...</a>
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
          </div>
          <div id="content">
    
          ${next.body()}
    
          </div><!-- container -->

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
        
      </div><!-- body_wrap -->
        <script>
            var activeMenuItem = null;
      
            String.prototype.format = function () {
                var args = arguments;
                return this.replace(/\{(\d+)\}/g, function (match, number) {
                    return typeof args[number] !== 'undefined' 
                        ? args[number]
                        : match;
                });
            };

            function setCookie(c_name,value,exdays)
            {
                var exdate=new Date();
                exdate.setDate(exdate.getDate() + exdays);
                var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
                document.cookie=c_name + "=" + c_value + "; path=/";
            }
            function getCookie(c_name)
            {
                var i,x,y,ARRcookies=document.cookie.split(";");
                for (i=0;i<ARRcookies.length;i++)
                {
                    x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
                    y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
                    x=x.replace(/^\s+|\s+$/g,"");
                    if (x==c_name)
                    {
                        return unescape(y);
                    }
                }
            }    
            function delCookie(name) {
                var today = new Date();
                today.setDate(today.getDate() - 1); //과거 시간으로 바꾸기
                var value = getCookie(name);
                if(value != "")
                    document.cookie = name + "=" + value + "; expires=" + today.toGMTString() + "; path=/";
            }
            function activateMenu(e) {
                var activeMenu = getCookie("active-menu"); 
                if (activeMenu) {
                    $("#" + activeMenu).removeClass("active-menu");
                }
                setCookie("active-menu", $(this).prop("id"), 1);
                $(this).addClass("active-menu");
                if ($(".active-menu a").length) {
                    $(location).attr("href", $(".active-menu a").attr("href"));
                }
            }
            function deactivateMenu(e) {
                var activeMenu = getCookie("active-menu"); 
                if (activeMenu) {
                    $("#" + activeMenu).removeClass("active-menu");
                    delCookie("active-menu");
                }
            }
            
            $(document).ready(function() {
                $("#header a").click(deactivateMenu);
                $(".mainmenu li").click(activateMenu);
                var activeMenu = getCookie("active-menu"); 
                if (activeMenu) {
                    $("#" + activeMenu).addClass("active-menu");
                }
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
                    height: 220,
                    width: 350,
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
                                console.log(json_data);
                                $.post("${request.route_path('blog_group_add')}", json_data, function() {
                                    $( location ).attr("href", "${request.route_path('blog_list') + '?category='}" + name.val());
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
        
                $( "#add-group" )
                    .click(function() {
                        $( "#dialog-form" ).dialog( "open" );
                    });
            });
            $("#name").keydown(function(event) {
                if (event.which == 13) {
                    event.preventDefault();
                }
            });
            </script>
        </div><!-- wrapper -->

    </body>
</html>
