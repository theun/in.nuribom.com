<!DOCTYPE html>
<html lang="ko">
    <head>
        <meta charset='utf-8'>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>누리인</title>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    
        <link rel="stylesheet" href="/static/jquery-ui/css/ui-lightness/jquery-ui-1.8.18.custom.css" media="screen" type="text/css" />

        <!-- Bootstrap -->
        <link href="/static/bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
        <link href="/static/bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet">

        <link href="/static/stylesheets/nurin.css" rel="stylesheet" media="screen">

        <script src="/static/jquery-ui/js/jquery-1.7.1.min.js"></script>
        <script src="/static/jquery-ui/js/jquery-ui-1.8.18.custom.min.js"></script>
        <script src="/static/bootstrap/js/bootstrap.min.js"></script>
        <script src="/static/javascripts/nurin.js"></script>
        <!--[if lt IE 9]>
        <script type="text/javascript" src="/static/javascripts/respond.min.js"></script>
        <script type="text/javascript" src="/static/javascripts/html5.js"></script>
        <![endif]-->
    </head>

    <body>
        <%include file="topnav.html" />
        <div class="container">
            <div class="body row-fluid" id="body">
                <section id="content" class="content">
                ${next.body()}
                </section>
            </div><!-- body_wrap -->
        </div><!-- container -->
        <%include file="footer.html" />
    </body>
</html>
