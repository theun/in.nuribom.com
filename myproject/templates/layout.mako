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
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# githubog: http://ogp.me/ns/fb/githubog#">
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>누리-인</title>
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub" />
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />

    <meta content="authenticity_token" name="csrf-param" />
    <meta content="oQWaFH1CgxJ/p5uR/osG5fSURVtY4GrwLLTb+S8SLM4=" name="csrf-token" />

    <link rel="stylesheet" href="/static/stylesheets/bundles/github.css" media="screen" type="text/css" />
	<link rel="stylesheet" href="/static/jquery-ui/css/ui-lightness/jquery-ui-1.8.18.custom.css" media="screen" type="text/css" />
	<link rel="stylesheet" href="/static/blueimp-jQuery-File-Upload-47bdcea/css/jquery.fileupload-ui.css">

    <script src="${request.static_url('myproject:static/jquery-ui/js/jquery-1.7.1.min.js')}"></script>
    <script src="${request.static_url('myproject:static/jquery-ui/js/jquery-ui-1.8.18.custom.min.js')}"></script>
    <script src="${request.static_url('myproject:static/javascripts/jquery.ui.datepicker-ko.js')}"></script>
	<script src="${request.static_url('myproject:static/blueimp-jQuery-File-Upload-47bdcea/js/vendor/jquery.ui.widget.js')}"></script>
	<script src="${request.static_url('myproject:static/blueimp-jQuery-File-Upload-47bdcea/js/jquery.iframe-transport.js')}"></script>
	<script src="${request.static_url('myproject:static/blueimp-jQuery-File-Upload-47bdcea/js/jquery.fileupload.js')}"></script>  
  </head>

  <body>

	<style type="text/css">
		#dialog_link {padding: .4em 1em .4em 20px;text-decoration: none;position: relative;}
		#dialog_link span.ui-icon {margin: 0 5px 0 0;position: absolute;left: .2em;top: 50%;margin-top: -8px;}
		ul#icons {margin: 0; padding: 0;}
		ul#icons li {margin: 2px; position: relative; padding: 4px 0; cursor: pointer; float: left;  list-style: none;}
		ul#icons span.ui-icon {float: left; margin: 0 4px;}
	</style>	
    <div id="wrapper">

      <div id="header" style="background: #E7EBF2;"> 
        <div class="container clearfix">
          <a class="site-logo" href="/">
            <img alt="nuribom-logo" class="github-logo-4x" height=30 src="/static/logo.png" />
            <img alt="nuribom-logo-hover" class="github-logo-4x-hover" height=30 src="/static/logo-hover.png" />  
          </a>
          <div class="topsearch ">
            <form accept-charset="UTF-8" action="/search" id="top_search_form" method="get">
              <input name="utf8" type="hidden" value="&#x2713;" />        
              <a href="/search" class="advanced-search tooltipped downwards" title="Advanced Search">
                <span class="mini-icon advanced-search"></span>
              </a>
              <div class="search placeholder-field js-placeholder-field">
                <label class="placeholder" for="global-search-field">인물검색</label>
                <input type="text" class="search my_repos_autocompleter" id="global-search-field" name="q" results="5" spellcheck="false" autocomplete="off" data-autocomplete="my-repos-autocomplete">
                <div id="my-repos-autocomplete" class="autocomplete-results">
                  <ul class="js-navigation-container"></ul>
                </div>
                <input type="submit" value="Search" class="button">
                <span class="mini-icon search-input"></span>
              </div>
              <input type="hidden" name="type" value="Everything" />
              <input type="hidden" name="repo" value="" />
              <input type="hidden" name="langOverride" value="" />
              <input type="hidden" name="start_value" value="1" />
            </form>
			<ul class="top-nav">
				<li class="explore"><a href="/blog/list/0">블로그</a></li>
			</ul>
          </div><!-- topsearch -->
          <div id="userbox">
	      % if login: 
            <div id="user">
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
        </div> 
      </div><!-- header -->

      <div class="site clearfix">
        <div class="container">

		<!-- ui-dialog -->
		<div id="dialog" title="Information">
			<p id="message"></p>
		</div>
			
      ${next.body()}

        </div><!-- container -->
      </div><!-- site clearfix -->
      
    </div><!-- wrapper -->

  </body>
</html>
