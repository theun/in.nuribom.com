# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>
<%
from myproject.views import log, image_thumbnail_info
from myproject.blog import get_time_ago
from myproject.models import User
from datetime import datetime
from pyramid.security import authenticated_userid

comments_len = len(post.comments)

page = 0
num_images = 15
if 'page' in request.params:
    page = int(request.params['page']) - 1

me = User.by_username(authenticated_userid(request))

likes = post.likes[:]
if me in post.likes:
    likes.remove(me)
likes_len = len(likes)

def is_image_gallery():
    return post.content.strip() == ""
%>

<%def name="image_gallery()">
    <p>${len(post.images)}장의 사진이 있습니다.</p> 

    % if page * num_images < post.images:
    <div id="gallery">
        % for url in post.images[page*num_images:(page+1)*num_images]:
        <% info = image_thumbnail_info(url.split('/')[-1]) %>
        <div class="box">
            <p>
                <a href="${url}" rel="prettyPhoto[pp_gal]" title="${info['name']}">
                    <img width="${info['width']}" height="${info['height']}" src="${url + '/thumbnail'}" />
                </a>
            </p>
        </div>
        % endfor
    </div>
    <nav id="page_nav">
        <a href="${request.route_path('blog_view', id=post.id) + '?page=2'}"></a>
    </nav>
    
    <link rel="stylesheet" href="/static/prettyPhoto/css/prettyPhoto.css" type="text/css" media="screen" charset="utf-8" />
    <script src="/static/javascripts/jquery.isotope.min.js"></script>
    <script src="/static/javascripts/jquery.infinitescroll.min.js"></script>
    <script src="/static/prettyPhoto/js/jquery.prettyPhoto.js"></script>
    <script>
        function doDeletePhoto() {
            if (confirm("사진을 삭제하시겠습니까?")) {
                $.post("/blog/${post.id}" + $("#fullResImage").attr("src") + "/delete", function() {
                    location.reload();
                }); 
            }
        }
        
        $(function(){
            $("a[rel^='prettyPhoto']").prettyPhoto({
                social_tools: '<a href="javascript:doDeletePhoto()">사진삭제</a>',
            });
            var $gallery = $('#gallery');
            $gallery.imagesLoaded( function(){
                $gallery.isotope({
                    itemSelector: '.box',
                });
            });
            $gallery.infinitescroll(
                {
                    navSelector  : '#page_nav',    // selector for the paged navigation 
                    nextSelector : '#page_nav a',  // selector for the NEXT link (to page 2)
                    itemSelector : '.box',     // selector for all items you'll retrieve
                    loading: {
                        finishedMsg: 'No more pages to load.',
                        img: '/static/images/busy.gif'
                    }
                },
                // call Isotope as a callback
                function( newElements ) {
                    $gallery.isotope( 'appended', $( newElements ) );
                    $("a[rel^='prettyPhoto']").prettyPhoto({
                        social_tools: '<a href="javascript:doDeletePhoto()">사진삭제</a>',
                    });
                    _.delay(function() {
                        $gallery.isotope({ itemSelector: '.box' });
                    }, 200); 
                }
            );
        });
    </script>
    % endif
</%def>

<div id="content-body" style="margin-top: 20px;">
</div>

<link rel="stylesheet" href="/static/stylesheets/blog.css" media="screen" type="text/css" />
<%include file="blog.html" />

<script>
    var app = new PostView({ model: new Post({id: '${post.id}'}) });
    app.listenTo(app.model, 'change', function() {
        $("#content-body").append(this.$el);
    });
</script>