define(["jquery", "backbone"],

	function($, Backbone) {
	
		var Like = Backbone.Model.extend({
			idAttribute: 'id',
		});
		
		return Like;
		
	}

);
