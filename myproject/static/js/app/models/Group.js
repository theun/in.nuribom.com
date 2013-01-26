define(["jquery", "backbone"],

	function($, Backbone) {
	
		var Group = Backbone.Model.extend({
		    idAttribute: 'id',

		    urlRoot: '/rest/group',
		    
		    initialize: function(attributes, options) {
		    	this.fetch();
		    },
		});
		
		return Group;

	}

);