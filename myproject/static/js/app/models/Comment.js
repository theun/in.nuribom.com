define(["jquery", "backbone"],

	function($, Backbone) {
	
		var Comment = Backbone.Model.extend({
			idAttribute: 'id',
		});
		
		return Comment;
		
	}

);
