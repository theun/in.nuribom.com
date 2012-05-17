# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>

<link rel="stylesheet" href="/static/stylesheets/blog.css" media="screen" type="text/css" />

<%
from myproject.views import log

log.warn(category)

title = ''
content = ''
if post:
	title = post.title
	content = post.content
%>

<div id="top-toolbar">
    <h3>${category}</h3>
    <a href="javascript:doSave()">저장</a>
    <a href="javascript:doCancel()">취소</a>
    <div id="description">
    제목은 반드시 입력하셔야 합니다.<br/>
    내용 편집은 Full Screen 모드로 전환하셔서 작업하시는 것이 편리합니다.<br/>
    </div>
</div>
<form accept-charset="UTF-8" action="${save_url}" method="post" enctype="multipart/form-data">
    <input type="hidden" name="category" value="${category}">
<div id="pages-composer">
    <div class="body">
      <dl class="form">
        <dt><label for="blog-title">제목</label></dt>
        <dd><input id="blog-title" name="title" size="30" type="text" value="${title}" /></dd>
      </dl>

      <dl class="form">
        <dt>
          <label for="blog-body">내용</label>
        </dt>
        <dd>
          <div id="blog-composer-wrapper">
			<textarea name="content">${content}</textarea>
          </div>
        </dd>
      </dl>

        % if post and len(post.attachments) > 0:
        <div class="blog-attachments">
            <p><strong>첨부파일 ${len(post.attachments)}개</strong></p>
            % for file in post.attachments:
            <p>
                <a href="${request.route_path('blog_attachment', id=post.id, filename=file.name)}" class="attachment-file">${file.name} (${file.length/1024}K)</a>
                <a href="${request.route_path('blog_attachment_del', id=post.id, filename=file.name)}" title="삭제">
                    <span class="ui-icon ui-icon-close ui-state-default ui-corner-all span_bar ">
                        <img width="18" height="18" src="/static/images/cleardot.gif">
                    </span>
                </a>&nbsp
            </p>
            % endfor
        </div>
        % endif

        <dl class="form">
            <dt><label for="blog-attachment">첨부</label></dt>
            <dd>
            <input id="blog-attachment" name="files[]" size="30" type="file" multiple/>
            </dd>
        </dl>
    </div>
</div>
<input id="save" name="commit" type="submit" style="display:none">
</form>

<script type="text/javascript" src="/static/tinymce/jscripts/tiny_mce/tiny_mce.js"></script>
<script type="text/javascript">
tinyMCE.init({
        // General options
        mode : "textareas",
        theme : "advanced",
        plugins : "pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",

		content_css : "/static/stylesheets/nurin.css",
		
        // Theme options
        theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect,fontselect,fontsizeselect",
        theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
        theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
        theme_advanced_toolbar_location : "top",
        theme_advanced_toolbar_align : "left",
        theme_advanced_resizing : true
});
function doCancel() {
    if (confirm("정말 취소 하시겠습니까?")) {
        $(location).attr("href", "${request.route_path('blog_list', category=category)}");
    }
}

function doSave() {
    if (!$("#blog-title").val().trim()) {
        alert("제목은 반드시 입력하셔야 합니다.");
        $("#blog-title").focus();
        return false;
    }
    $("#save").click();
}
$(document).ready(function() {
    $("#page_name").focus();
    $("#save").click(function(e) {
        if ($("#page_name").val() == false) {
            e.preventDefault();
            alert("제목은 반드시 입력하셔야 합니다.");
            $("#page_name").focus();
        }
    });
});
</script>
