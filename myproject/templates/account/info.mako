# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>
<%
from myproject.views import log
from datetime import datetime
 
category_name = request.matchdict['category']
thisyear = datetime.now().year

action = request.params['action'] if 'action' in request.params else ''
target = request.params['target'] if 'target' in request.params else ''
%>

<link rel="stylesheet" type="text/css" href="/static/stylesheets/info.css">
<div id="wrap" class="info02_pg">
	<div id="bodyWrap">
		<div class="page_navi">
			<h3 style="font-size: 20px; margin: 0;">개인 정보</h3>
		</div>
		<div class="description">
			아래 정보 중 변경된 내용이 있는 경우 아래에서 해당 내용을 수정해 주시기 바랍니다.<br/>
			편집을 취소하시려면 편집 중에 ESC키를 누르세요.
		</div>
		<div id="infoTable" class="default_info">
			<ul style="display: inline-block; height:42px">
			<% 
			categories = ['basic', 'family', 'school', 'carrier', 'salary']
			category_names = [u'기본정보', u'가족정보', u'학력정보', u'경력정보', u'연봉정보']
			%>
			% for i in range(len(categories)):
				<li${' class="active"' if category_name == categories[i] else ''|n}>
					<a href="${request.route_url('account_info', username=user.username, category=categories[i])}">${category_names[i]}</a>
				</li>
			% endfor
			</ul>
			
			% if category_name == categories[0]:
			<%include file="info_basic.html" />
			% elif category_name == categories[1]:
			<%include file="info_family.html" />
			% elif category_name == categories[2]:
			<%include file="info_school.html" />
			% elif category_name == categories[3]:
			<%include file="info_carrier.html" />
		% endif
		</div> <!-- //infoTable -->
	</div> <!-- // bodyWrap -->
</div>

<script>
var editId = null
var inputHTML_ = {
	'school': '\
		<div id="info-row-input" class="info-row disable">\
			<div class="lfloat col-name">\
				<input id="school-name-input" value="{0}" class="input_text name">\
			</div>\
			<div class="lfloat col-relation">\
				<input id="school-relation-input" value="{1}" class="input_text name">\
			</div>\
			<div class="col-birthday">\
				<input id="school-birthday-input" value="{2}" class="input_text name">\
				<a href="' + "javascript:doSave({3}, 'school', ['name', 'type', 'major', 'degree', 'graduate_date'])" + '" class="right-align">\
					<span class="ui-icon ui-icon-disk ui-state-default ui-corner-all">저장</span>\
				</a>\
			</div>\
		</div>',
	'carrier': '\
		',
	};

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (match, number) {
        return typeof args[number] !== 'undefined' 
            ? args[number]
            : match;
    });
};

function doEdit(id, class_name) {
	if (editId != null) 
		$("#info-row-" + editId).show();
		
	editId = id
	$("#info-row-input").remove();

	var url = "${request.route_url('account_info_get', username=user.username, category=category_name)}" + "?id=" + id;
	$.get(url, function(data) {
		$("#info-row-" + id).fadeOut(function() { showForm(id, data, class_name); });
	}, "json");
}

function doDelete(id) {
	if (confirm("정말 삭제하시겠습니까?")) {
		var url = "${request.route_url('account_info_save', username=user.username, category=category_name)}" 
			+ "?id=" + id + "&action=delete";
		$.post(url, function(data) {
			$("#info-row-" + id).fadeOut(function(){ $("#info-row-" + id).remove(); });
			$(location).attr('href', $(location).attr('href'))
		}, "json");
	}
}

function doSave(id, fields) {
	var url = "${request.route_url('account_info_save', username=user.username, category=category_name)}" + "?id=" + id;
	var data = {}
	$.each(fields, function(index, value) {
		data[value] = $('#info-' + value + '-input').val(); 
	});
	data['id'] = id;
	$.post(url, data, function(data) {
		var info_id = $(".table01").children().eq(-2).attr('id')
		var last_id = info_id.substr(info_id.lastIndexOf('-')+1, info_id.length-1)
		if (parseInt(last_id) == id) {
			var pattern = new RegExp(last_id, 'g')
			var add_row = $(".table01").children().eq(-2).prop('outerHTML')
			$(".table01 .span_bar").last().removeClass("disable")
			$(".table01").append(add_row.replace(pattern, (parseInt(last_id)+1).toString()))
			doCancel(id+1);
			$("#info-row-" + id).fadeIn();
		}
		else {
			doCancel(id);
		}
		
		if ('message' in data) {
			$("#message").html(data.message);
			$('#dialog').dialog('open');
		}
		
		if ('id' in data) {
			$.each(fields, function(index, value){
				$('#info-' + value + '-' + id).html(data[value]);
			});
		}
	}, "json");
}

function doCancel(id) {
	$("#info-row-input").fadeOut(function() {
		$("#info-row-" + id).fadeIn();
		$("#info-row-input").remove();
		editId = null
	});
}

$(document).ready(function() {
	// Dialog			
	$('#dialog').dialog({
		autoOpen: false,
		width: 600,
		buttons: {
			"확인": function() { 
				$(this).dialog("close"); 
			}, 
		}
	});
	$('#dialog_link, ul#icons li').hover(
		function() { $(this).addClass('ui-state-hover'); }, 
		function() { $(this).removeClass('ui-state-hover'); }
	);
	$(document).keydown(function(event) {
		if (event.which == 27) {
			doCancel(editId);
		}
	});	
	$(function () {
	    $('#fileupload').fileupload({
	        dataType: 'json',
	        done: function (e, data) {
	            $.each(data.result, function (index, file) {
					$(location).attr('href', $(location).attr('href'))
	            });
	        }
	    });
	});
});
</script>
