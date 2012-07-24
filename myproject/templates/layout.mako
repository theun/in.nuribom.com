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
        
        <script src="/static/jquery-ui/js/jquery-1.7.1.min.js"></script>
        <script src="/static/jquery-ui/js/jquery-ui-1.8.18.custom.min.js"></script>
        <script src="/static/javascripts/jquery.ui.datepicker-ko.js"></script>
        <script src="/static/javascripts/nurin.js"></script>
        <!--[if lt IE 9]>
        <script type="text/javascript" src="/static/javascripts/respond.min.js"></script>
        <script type="text/javascript" src="/static/javascripts/html5.js"></script>
        <![endif]-->
    </head>

    <body>
        <div id="wrapper">
            <div class="container">
                <%include file="header.html" />

                <div class="body" id="body">
                    <section id="content" class="content">
                    ${next.body()}
                    </section>
        
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
                </div><!-- body_wrap -->

                <%include file="footer.html" />
            </div><!-- container -->

            <script>
                $(document).ready(function() {
                    $(".popup-menu").append($(".side-menu").html());
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
        
                function doOpenGroupDialog() {
                    $(window).trigger("popup.hide");
                    $( "#dialog-form" ).dialog( "open" );
                }
                
            </script>
        </div><!-- wrapper -->
    </body>
</html>
