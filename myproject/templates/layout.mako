<% 
from pyramid.security import authenticated_userid
from myproject.models import User

if authenticated_userid(request):
	login = User.by_username(authenticated_userid(request)) 
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
          <a class="site-logo" href="/">Nuribom</a>
          <div class="topsearch ">
            <form accept-charset="UTF-8" action="/search" id="top_search_form" method="get">
              <a href="/search" class="advanced-search tooltipped downwards" title="Advanced Search">
                <span class="mini-icon advanced-search"></span>
              </a>
              <div class="search placeholder-field js-placeholder-field">
                <label class="placeholder" for="global-search-field">검색: </label>
                <input type="text" class="search my_repos_autocompleter" id="global-search-field" name="q" results="5" spellcheck="false" autocomplete="off" data-autocomplete="my-repos-autocomplete">
                <input type="submit" value="Search" class="button">
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
			      <span class="mini-icon account-settings"></span>
			    </a>
			  </li>
              <li>
                <a href="${request.route_path('logout')}">
                  <span class="mini-icon logout"></span>
                </a>
              </li>
            </ul>
          % else:
            <ul class="top-nav">
              <li class="login"><a href="/login">로그인</a></li>
            </ul>
          % endif
          </div><!-- userbox -->
      </div><!-- header -->
      <div id="body_wrap">
      <div id="menu-bar">
        <div id="announce-menu" class="mainmenu mainmenu-on">
            <h2>사내소식</h2>
            <ol>
                <li id="menu-comp-news"><a href="${request.route_path('blog_list', category='새소식')}">새소식</a></li>
                <li id="menu-comp-teams"><a href="${request.route_path('team')}">조직도</a></li>
                <li id="menu-comp-account"><a href="${request.route_path('employees')}">비상연락망</a></li>
            </ol>
        </div>
        <div id="personal-menu" class="mainmenu mainmenu-on">
            <h2>나의활동</h2>
            <ol>
                <li id="menu-person-blog"><a href="${request.route_path('blog_list', category='블로그')}">블로그</a></li>
                <li id="menu-person-todo"><a href="${request.route_path('blog_list', category='할일')}">할일</a></li>
            </ol>
        </div>
        <div id="file-menu" class="mainmenu mainmenu-on">
            <h2>자료실</h2>
            <ol>
                <li id="menu-pds-form">회사서식</li>
                <li id="menu-pds-share">공유자료</li>
                <li id="menu-pds-etc">기타자료</li>
            </ol>
        </div>
        <div id="nurin-menu" class="mainmenu mainmenu-on">
            <h2>누리인</h2>
            <ol>
                <li id="menu-nurin-req"><a href="${request.route_path('blog_list', category='요청사항')}">요청사항</a></li>
            </ol>
        </div>
        % if login and 'group:staff' in login.groups:
        <div id="staff-menu" class="mainmenu mainmenu-on">
            <h2>경영정보</h2>
            <ol>
                <li id="menu-staff-meeting">경영회의</li>
                <li id="menu-staff-result">경영실적</li>
                <li id="menu-staff-todo">경영안건</li>
                <li id="menu-staff-salary">연봉</li>
            </ol>
        </div>
        % endif
        % if login and ('group:admin' in login.groups or 'admin:*' in login.permissions):
        <div id="admin-menu" class="mainmenu mainmenu-on">
            <h2>관리자메뉴</h2>
            <ol>
                <li id="menu-admin-account"><a href="${request.route_path('admin_account')}">계정관리</a></li>
                <li id="menu-admin-team"><a href="${request.route_path('admin_team')}">조직관리</a></li>
                <li id="menu-admin-perm"><a href="${request.route_path('admin_permission')}">권한관리</a></li>
                <li id="menu-admin-group"><a href="${request.route_path('admin_group')}">권한그룹관리</a></li>
                <li id="menu-admin-blog"><a href="${request.route_path('admin_blog')}">블로그관리</a></li>
            </ol>
        </div>
        % endif
      </div>
      <div class="container">

      ${next.body()}

      </div><!-- container -->

        <!-- ui-dialog -->
        <div id="dialog" title="Information">
            <p id="message"></p>
        </div>
      </div><!-- body_wrap -->
        <script>
            var activeMenuItem = null;
          
            function resizeLayout() {
                var containerMarginWidth = parseInt($(".container").css("margin-left")) +
                                        parseInt($(".container").css("margin-right"));
                
                $(".container").css("left", $("#menu-bar").outerWidth());
                $(".container").height($(window).height() - $("#header").outerHeight());
                $("#menu-bar").height($(window).height() - $("#header").outerHeight());
                $(".container").width($(window).width() - $("#menu-bar").outerWidth() - containerMarginWidth);
                
                if ($("#content-body") && $("#top-toolbar")) {
                    $("#content-body").height($(".container").innerHeight() - $("#top-toolbar").outerHeight())
                }
            }
      
            function toggleMenu(e) {
                var mainmenu = $(this).parent();
                if (mainmenu.hasClass("mainmenu-on")) {
                    mainmenu.removeClass("mainmenu-on");
                    $("ol", mainmenu).slideUp(function() {
                        mainmenu.addClass("mainmenu-off");
                    });
                }
                else {
                    mainmenu.addClass("mainmenu-on");
                    $("ol", mainmenu).slideDown(function() {
                        mainmenu.removeClass("mainmenu-off");
                    });
                }
            }
      
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
                resizeLayout();
                $(window).resize(function(e) {
                    e.preventDefault();
                    resizeLayout();
                });
                
                $("#header a").click(deactivateMenu);
                $(".mainmenu > h2").click(toggleMenu);
                $(".mainmenu li").click(activateMenu);
                var activeMenu = getCookie("active-menu"); 
                if (activeMenu) {
                    $("#" + activeMenu).addClass("active-menu");
                }
            });
            </script>
        </div><!-- wrapper -->

    </body>
</html>
