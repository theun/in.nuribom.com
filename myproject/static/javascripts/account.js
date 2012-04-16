function toggleUserField(id) {
	var view_id = '#' + id + '_view'
	var edit_id = '#' + id + '_edit'
	
	$('#' + id).keydown(function(event){
		if (event.which == 27)
			$('#' + id + '_cancel').click();
	});
	$(view_id + ' a').click(function(event){
		event.preventDefault();
		$(view_id).hide();
		$(edit_id).fadeIn();
		if (id == 'password'){
			$('#old_password').focus();
		}
		else {
			$('#' + id).focus();
		}
	});
	$(edit_id + ' a').click(function(event){
		event.preventDefault();
		$(edit_id).hide();
		if ($.trim($(this).text()) == '저장'){
			var data = {};
			var result = false;
			if (id == 'password'){
				data['old_password'] = $('#old_password').val();
				data['new_password'] = $('#new_password').val();
				data['confirm_password'] = $('#confirm_password').val();
				data['POST'] = $(this).attr("id");
				$.post($(this).attr("href"), data, function(data){
					$('#old_password').val('');
					$('#new_password').val('');
					$('#confirm_password').val('');
					$("#message").html(data.message);
				}, "json");
			}
			else{
				data[id] = $('#' + id).val();
				data['POST'] = $(this).attr("id");
				$.post($(this).attr("href"), data, function(data){
					$("#message").html(data.message);
					$('#' + id + '_value').html(data.value);
				}, "json");
			}
			
			$('#dialog').dialog('open');
		}
		$(view_id).fadeIn();
	});
}

$(document).ready(function() {
	toggleUserField("password");
	toggleUserField("name");
	toggleUserField("birthday");
	toggleUserField("mobile");
	toggleUserField("phone"); 
	toggleUserField("phone1");
	toggleUserField("email"); 
	toggleUserField("email1"); 
	toggleUserField("address");
	toggleUserField("address1");
	$('.birthday').datepicker({ inline: true });

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
});
