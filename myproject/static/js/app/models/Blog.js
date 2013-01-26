define(["jquery", "backbone", "collections/Likes", "collections/Comments"],

	function($, Backbone, Likes, Comments) {
	
		var Blog = Backbone.Model.extend({
		    idAttribute: 'id',
		    
		    urlRoot: '/rest/blog',
		    
		    initialize: function(attributes, options) {
		    	var attrs = attributes || {};
		    	
		    	this.likes = new Likes(undefined, { parent: this });
		    	this.comments = new Comments(undefined, { parent: this });
		
		    	if (this.collection) {
			    	this.loadExtra();  
		    	} else {
		    		this.fetch();
			    	this.on('change', this.loadExtra, this);
		    	}
		    },
		    
		    loadExtra: function(model, options) {
		    	var that = this;
		    	this.likes.fetch();
		    	this.comments.fetch({success: function() {
		    		that.trigger('loaded', that);
		    	}});
		    }
		});
		
		return Blog;

	}

);