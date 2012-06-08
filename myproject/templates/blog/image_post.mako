# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>

<link rel="stylesheet" href="/static/stylesheets/blog.css" media="screen" type="text/css" />
<link rel="stylesheet" type="text/css" href="/static/plupload/js/jquery.plupload.queue/css/jquery.plupload.queue.css" charset="utf-8"/>
<link rel="stylesheet" href="/static/daumeditor/css/popup.css" type="text/css"  charset="utf-8"/>
<script type="text/javascript" src="/static/plupload/js/plupload.full.js"></script>
<script type="text/javascript" src="/static/plupload/js/jquery.plupload.queue/jquery.plupload.queue.js"></script>
<script type="text/javascript">
// <![CDATA[
    
    function done() {
        var uploader = $("#html5_uploader").pluploadQueue()
        var list = [];
        for (var i = 0, len = uploader.files.length; i < len; i++) {
            if (uploader.files[i].status == plupload.DONE) {
                list.push('/images/' + uploader.files[i].id);
            }
        }
        
        if (list.length > 0) {
            json_params = {
                "title": $("#image-title").val(),
                "images": list.join()
            };
            $.post("${save_url}", 
                json_params,
                function(result) {
                    $(location).attr("href", result.redirect);
                },
                "json"
            );
        }
        else {
            $(location).attr("href", redirect);
        }
        return true;
    }

    function initUploader(){
        var _opener = PopupUtil.getOpener();
        if (!_opener) {
            alert('잘못된 경로로 접근하셨습니다.');
            return;
        }
        
        var _attacher = getAttacher('image', _opener);
        registerAction(_attacher);
    }
// ]]>


    // Convert divs to queue widgets when the DOM is ready
    $(function() {
        // Setup html5 version
        var uploader = $("#html5_uploader").pluploadQueue({
            // General settings
            runtimes : 'html5',
            url : '/upload/images',
            max_file_size : '10gb',
            chunk_size : '4mb',
            dragdrop : true,

            // Resize images on clientside if we can
            resize : {width : 800, height : 600, quality : 100},

            // Specify what files to browse for
            filters : [
                {title : "Image files", extensions : "jpg,gif,png"},
                {title : "Zip files", extensions : "zip"}
            ]
        });
        $("#html5_uploader").pluploadQueue().bind('BeforeUpload', function(up, file) {
            if ($("#busy").css('opacity') == 0) {
                $("#busy").css('opacity', 1);
            }
            up.settings.multipart_params = {id: file.id}
        });
        $("#html5_uploader").pluploadQueue().bind('UploadComplete', done);
        $("#image-title").keydown(function(event) {
            if (event.which == 13) {
                event.preventDefault();
            }
            else {
                if ($(this).val()!="") {
                    $(".plupload_button").show();
                }
                else {
                    $(".plupload_button").hide();
                }
            }
        });
    });
    
    $(document).ready(function() {
        setTimeout('$(".plupload_button").hide()', 100);
    });

</script>

<div id="top-toolbar">
    <h3>${category}</h3>
</div>
<div id="content-body" onload="initUploader();">
<form name="image_form" id="image_form" action="${save_url}" method="post" accept-charset="utf-8">
    <div class="wrapper">
        <div class="header" style="background: black; margin: 8px;">
            <h1 style="margin-top: 5px;">
                사진 첨부
                <img id="busy" width="24" height="24" src="/static/images/busy.gif" style="opacity: 0">
            </h1>
        </div>  
        <div style="padding: 0 18px;">
            제목: 
            <input id="image-title" name="title" type="text" autocomplete="off" value="" placeholder="제목은 반드시 입력하셔야 합니다..."/>
        </div>
        <div class="body">
            <div id="html5_uploader" style="height: 330px; position: relative; ">
                <div class="plupload_wrapper plupload_scroll">
                    <div id="html5_uploader_container" class="plupload_container">
                        <div class="plupload">
                            <div class="plupload_header">
                                <div class="plupload_header_content">
                                    <div class="plupload_header_title">Select files</div>
                                    <div class="plupload_header_text">Add files to the upload queue and click the start button.</div>
                                </div>
                            </div>
                            <div class="plupload_content">
                                <div class="plupload_filelist_header">
                                    <div class="plupload_file_name">Filename</div>
                                    <div class="plupload_file_action">&nbsp;</div>
                                    <div class="plupload_file_status">
                                        <span>Status</span>
                                    </div>
                                    <div class="plupload_file_size">Size</div>
                                    <div class="plupload_clearer">&nbsp;</div>
                                </div>
                                <ul id="html5_uploader_filelist" class="plupload_filelist">
                                    <li class="plupload_droptext">Drag files here.</li>
                                </ul>
                                <div class="plupload_filelist_footer">
                                    <div class="plupload_file_name">
                                        <div class="plupload_buttons">
                                            <a href="#" class="plupload_button plupload_add" id="html5_uploader_browse" style="position: relative; z-index: 0; ">Add files</a>
                                            <a href="#" class="plupload_button plupload_start plupload_disabled">Start upload</a>
                                        </div>
                                        <span class="plupload_upload_status"></span>
                                    </div>
                                    <div class="plupload_file_action"></div>
                                    <div class="plupload_file_status">
                                        <span class="plupload_total_status">0%</span>
                                    </div>
                                    <div class="plupload_file_size">
                                        <span class="plupload_total_file_size">0 b</span>
                                    </div>
                                    <div class="plupload_progress">
                                        <div class="plupload_progress_container">
                                            <div class="plupload_progress_bar"></div>
                                        </div>
                                    </div>
                                    <div class="plupload_clearer">&nbsp;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <input type="hidden" id="html5_uploader_count" name="html5_uploader_count" value="0">
                </div>
                <div id="p16uf325mmj2kqu3tuc4gfrt44_html5_container" style="
                        position: absolute; 
                        background-image: initial; 
                        background-attachment: initial; 
                        background-origin: initial; 
                        background-clip: initial; 
                        background-color: transparent; 
                        overflow-x: hidden; 
                        overflow-y: hidden; 
                        opacity: 0; 
                        top: 292px; 
                        left: 16px; 
                        width: 75px; 
                        height: 22px; 
                        z-index: -1; 
                        background-position: initial initial; 
                        background-repeat: initial initial; " class="plupload html5">
                    <input id="p16uf325mmj2kqu3tuc4gfrt44_html5" style="
                        font-size: 999px; 
                        position: absolute; 
                        width: 100%; 
                        height: 100%; " type="file" accept="image/jpeg,image/gif,image/png,application/zip" multiple="multiple">
                </div>
            </div>
        </div>
    </div>
</div>
