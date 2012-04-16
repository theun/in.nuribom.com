# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>

<link rel="stylesheet" href="/static/stylesheets/blog.css" media="screen" type="text/css" />

<%
title = ''
content = ''
if post:
	title = post.title
	content = post.content
%>

<form accept-charset="UTF-8" action="${save_url}" method="post">
<div id="pages-composer">
    <div class="body">

      <dl class="form">
        <dt><label for="page_name">제목</label></dt>
        <dd><input id="page_name" name="title" size="30" type="text" value="${title}" /></dd>
      </dl>

      <dl class="form">
        <dt>
          <label for="page_body">내용</label>
        </dt>
        <dd>
          <div id="pages-composer-wrapper">
            <div id="gollum-editor" class="create">
				<textarea class="expanding" format="markdown" id="gollum-editor-body" name="content">${content}</textarea>
				<span class="jaws"><br></span>
            </div>
          </div>
        </dd>
      </dl>

    </div>
  </div>

  <div class="form-actions">
    <button name="cancel" type="submit" class="classy primary">
      <span>취소</span>
    </button>
    <button name="commit" type="submit" class="classy primary">
      <span>저장</span>
    </button>
  </div>
</form>

<script type="text/javascript" src="/static/tinymce/jscripts/tiny_mce/tiny_mce.js"></script>
<script type="text/javascript">
tinyMCE.init({
        // General options
        mode : "textareas",
        theme : "advanced",
        plugins : "pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",

		content_css : "/static/tinymce/examples/css/word.css",
		
        // Theme options
        theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect,fontselect,fontsizeselect",
        theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
        theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
        theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
        theme_advanced_toolbar_location : "top",
        theme_advanced_toolbar_align : "left",
        theme_advanced_statusbar_location : "bottom",
        theme_advanced_resizing : true
});
</script>
