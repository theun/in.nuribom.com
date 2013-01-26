// SearchView.js
// -------------
define(["jquery", "backbone", "collections/SearchResults", 
        "text!templates/search.html", "text!templates/search_user.html", "text!templates/search_blog.html"],

    function($, Backbone, SearchResults,
    		templateSearch, templateSearchUser, templateSearchBlog){

        var View = Backbone.View.extend({
        	el: $("#content"),

            // View constructor
            initialize: function() {
            	_.bindAll(this, "render");
            	_.bindAll(this, "appendRender");
            	_.bindAll(this, 'resize');
            	
            	$(window).on('resize', this.resize);

            	this.collection = new SearchResults([], this.options);
            	this.collection.fetch({
            		success: this.appendRender,
            		data: this.options,
            	});
            	this.render();
            	this.infiniScroll = new Backbone.InfiniScroll(this.collection, {
            		includePage: true,
            		success: this.appendRender
            	});
            },

            // View Event Handlers
            events: {},

            // Renders the view's template to the UI
            render: function() {
            	this.$el.html(_.template(templateSearch, this.options));

                // Maintains chainability
                return this;
            },
            
            appendRender: function(collection) {
            	var $container = $('#post-list'); 
            	collection.each(function(result) {
            		if (result.get('user')) {
            			output = _.template(templateSearchUser, result.toJSON());
            		} else {
            			output = _.template(templateSearchBlog, result.toJSON());
            		}
        			$container.append($(output));
            	});

            	postWidth = $container.find(".post").outerWidth();
                gutterWidth = (postWidth < $container.width() ? $container.width() - postWidth * 2 : 0);
                $container.isotope({
                	itemSelector: '.post',
                	masonry: {columnWidth : postWidth, gutterWidth: gutterWidth}
                })

                $(window).resize();
            },
            
            resize: function(e) {
            	var $container = $('#post-list'); 

            	postWidth = $container.find(".post").outerWidth();
                gutterWidth = (postWidth < $container.width() ? $container.width() - postWidth * 2 : 0);
        		$container.isotope('reloadItems').isotope('reLayout').isotope({
                	itemSelector: '.post',
                	masonry: {columnWidth : postWidth, gutterWidth: gutterWidth}
                })
            },
            
            unload: function(e) {
            	console.log('SearchView:unload()')
            }
        });

        // Returns the View class
        return View;

    }

);