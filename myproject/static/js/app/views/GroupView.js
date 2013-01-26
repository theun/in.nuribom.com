// GroupView.js
// ------------
define(["jquery", "backbone", "collections/Blogs", "views/BlogView", "text!templates/group.html"],

    function($, Backbone, Blogs, BlogView, templateGroup){

        var View = Backbone.View.extend({
        	el: $("#content"),

        	// View constructor
            initialize: function() {
            	var that = this;
            	
            	this.options = _.omit(this.options, 'model');
            	_.bindAll(this, "render");
            	_.bindAll(this, "appendRender");
            	_.bindAll(this, 'resize');
            	
            	$(window).on('resize', this.resize);
            	this.listenTo(this.model, 'change', function(model) {
            		that.render();
                	that.collection.fetch({
                		success: that.appendRender,
                		data: _.extend(that.options, {gid: model.id})
                	});
            	});
            	
            	this.collection = new Blogs([], this.options);
            	this.infiniScroll = new Backbone.InfiniScroll(this.collection, {
            		extraParams: {gid: this.model.id},
            		includePage: true,
            		success: this.appendRender
            	});
            	
            	if (this.options.page_size) {
            		this.infiniScroll.options.pageSize = this.options.page_size;
            	}
            },

            // View Event Handlers
            events: {
            },

            // Renders the view's template to the UI
            render: function() {
            	this.$el.html(_.template(templateGroup, this.model.toJSON()));

                // Maintains chainability
                return this;

            },

            appendRender: function(collection) {
            	var $container = this.$el.find('#post-list'); 
            	this.collection.each(function(blog) {
            		var view = new BlogView({model: blog, list: true});
            		$container.append(view.render().el);
            	});

            	postWidth = $container.find(".post").outerWidth(true);
                gutterWidth = (postWidth < $container.width() ? $container.width() - postWidth * 2 : 0);
                $container.isotope({
                	itemSelector: '.post',
                	masonry: {columnWidth : postWidth, gutterWidth: gutterWidth}
                })

                $(window).resize();
            },
            
            resize: function(e) {
            	var $container = $('#post-list'); 
            	var $gallery = $('.gallery');
            	
            	if ($gallery) {
            		width = $gallery.innerWidth() - parseInt($gallery.css('padding-left')) - parseInt($gallery.css('padding-right'));
            		$box = $('.box');
            		boxWidth = width / 3 - ($box.outerWidth(true) - $box.innerWidth());
            		$box.width(boxWidth);
            	}
            	postWidth = $container.find(".post").outerWidth(true);
                gutterWidth = (postWidth < $container.width() ? $container.width() - postWidth * 2 : 0);
        		$container.isotope('reloadItems').isotope('reLayout').isotope({
                	itemSelector: '.post',
                	masonry: {columnWidth : postWidth, gutterWidth: gutterWidth}
                })
            }
        });

        // Returns the View class
        return View;

    }

);