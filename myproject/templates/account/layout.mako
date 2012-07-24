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
        
    	<link rel="stylesheet" href="/static/jquery-ui/css/smoothness/jquery-ui-1.8.21.custom.css" media="screen" type="text/css" />
        <link rel="stylesheet" href="/static/stylesheets/nurin.css" media="screen" type="text/css" />
        <link rel="stylesheet" href="/static/stylesheets/blog.css" media="screen" type="text/css" />
        
        <script src="/static/jquery-ui/js/jquery-1.7.2.min.js"></script>
        <script src="/static/jquery-ui/js/jquery-ui-1.8.21.custom.min.js"></script>
        <script src="/static/javascripts/nurin.js"></script>
        <!--[if lt IE 9]>
        <script type="text/javascript" src="/static/javascripts/respond.min.js"></script>
        <script type="text/javascript" src="/static/javascripts/html5.js"></script>
        <![endif]-->
    </head>

    <body>
        <div id="wrapper">
            <div class="container">
                <%include file="../header.html" />

                <div class="body">
                    <section id="content" class="content">
                    ${next.body()}
                    </section>
        
                    <nav class="side-menu">
                        <div id="menu-person" class="mainmenu mainmenu-on">
                            <h2>인사정보</h2>
                            <ol>
                                <li id="menu-person-basic">
                                    <img src="/static/images/account.png">
                                    <a href="${request.route_path('account_info', username=user.username, category='basic')}">개인정보</a>
                                </li>
                                % if user.username == authenticated_userid(request):  
                                <li id="menu-person-family">
                                    <img src="/static/images/account.png">
                                    <a href="${request.route_path('account_info', username=user.username, category='family')}">가족정보</a>
                                </li>
                                <li id="menu-person-school">
                                    <img src="/static/images/account.png">
                                    <a href="${request.route_path('account_info', username=user.username, category='school')}">학력정보</a>
                                </li>
                                <li id="menu-person-carrier">
                                    <img src="/static/images/account.png">
                                    <a href="${request.route_path('account_info', username=user.username, category='carrier')}">경력정보</a>
                                </li>
                                <li id="menu-person-salary">
                                    <img src="/static/images/account.png">
                                    <a href="${request.route_path('account_info', username=user.username, category='salary')}">연봉정보</a>
                                </li>
                                % endif
                            </ol>
                        </div>
                        % if user.username == authenticated_userid(request):  
                        <div id="menu-settings" class="mainmenu mainmenu-on">
                            <h2>설정</h2>
                            <ol>
                                <li id="menu-settings-notification">
                                    <img src="/static/images/config.png">
                                    <a href="${request.route_path('account_info', username=user.username, category='notification')}">알림설정</a>
                                </li>
                            </ol>
                        </div>
                        % endif
                    </nav>
                </div><!-- body_wrap -->

                <%include file="../footer.html" />
            </div><!-- container -->

            <script>
                $(document).ready(function() {
                    $(".popup-menu").append($(".side-menu").html());
                });
            </script>
        </div><!-- wrapper -->
    </body>
</html>
