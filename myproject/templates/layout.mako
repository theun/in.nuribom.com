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
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub" />
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
			<ul class="top-nav">
				<li class="explore"><a href="/blog/list/0">블로그</a></li>
			</ul>
          </div><!-- topsearch -->
          <div id="userbox">
	      % if login: 
            <div id="user-info">
              <a href="${request.route_url('account_main', username=login.username)}">
                <img height="20" src="${request.route_url('account_photo', username=login.username)}">
              </a>
              <a href="${request.route_url('account_main', username=login.username)}" class="name">
                ${login.name}
              </a>
            </div>
            <ul id="user-links">
			  <li>
			    <a href="${request.route_url('account_info', username=login.username, category='basic')}">
			      <span class="mini-icon account-settings"></span>
			    </a>
			  </li>
              <li>
                <a href="${request.route_url('logout')}">
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

      <div id="menu-bar">
        <div id="accounce-menu" class="mainmenu mainmenu-on">
            <h2>사내소식</h2>
            <ol>
                <li>공지사항</li>
                <li>소식지</li>
                <li>희망회의</li>
                <li>조직도</li>
                <li>비상연락망</li>
            </ol>
        </div>
        <div id="personal-menu" class="mainmenu mainmenu-on">
            <h2>나의활동</h2>
            <ol>
                <li>블로그</li>
                <li>할일</li>
            </ol>
        </div>
        <div id="file-menu" class="mainmenu mainmenu-on">
            <h2>자료실</h2>
            <ol>
                <li>회사서식</li>
                <li>공유자료</li>
            </ol>
        </div>
        <div id="staff-menu" class="mainmenu mainmenu-on">
            <h2>경영정보</h2>
            <ol>
                <li>경영회의</li>
                <li>경영실적</li>
                <li>경영안건</li>
                <li>연봉</li>
            </ol>
        </div>
      </div>
      <div class="container">

      ${next.body()}

      </div><!-- container -->

        <!-- ui-dialog -->
        <div id="dialog" title="Information">
            <p id="message"></p>
        </div>
            
      <script>
      function resizeContainer() {
        $(".container").height($(window).height() - $("#header").height() - 1);
        $(".container").width($(window).width() - $("#menu-bar").width() - 31);
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
      
      $(document).ready(function() {
        resizeContainer();
        $(window).resize(function(e) {
            e.preventDefault();
            resizeContainer();
        });
        
        $(".mainmenu > h2").click(toggleMenu);
      });
      </script>
    </div><!-- wrapper -->

  </body>
</html>
