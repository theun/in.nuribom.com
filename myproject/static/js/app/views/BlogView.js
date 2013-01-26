// BlogView.js
// -------------
define(["jquery", "underscore", "backbone", "models/Blog", 
        "text!templates/blog_thumb.html",
        "text!templates/blog_view.html",
        "text!templates/blog_toolbar.html",
        "text!templates/blog_like.html",
        "text!templates/blog_comments.html",
        "text!templates/blog_comment.html"],

    function($, _, Backbone, Blog,
    		templateBlogThumb,
    		templateBlogView,
    		templateToolbar, 
    		templateLike,
    		templateComments,
    		templateComment){

		var LikeView = Backbone.View.extend({
		    tagName: 'span',
		    initialize: function() {
		    },
		    render: function() {
		        this.$el.html(_.template(templateLike, this.model.toJSON()));
		        return this;
		    },
		});
	
		var LikesView = Backbone.View.extend({
		    className: 'post-likes',
		    initialize: function() {
		        this.listenTo(this.model, 'reset add remove', this.addAll);
		        this.render();
		    },
		    render: function() {
		    	this.$el.html('');
		    },
		    addOne: function(like) {
		    	var view = new LikeView(_.extend(this.options, {model: like}));
		        this.$el.append(view.render().el);
		    },
		    addAll: function() {
		    	if (this.model.length > 0) {
		    		this.$el.html('');
		        	this.$el.append('<i class="icon-heart"></i> ');
		        	this.model.each(this.addOne, this);
		        	this.$el.append('님이 좋아합니다.');
		        	this.$el.show();
		    	} else {
		    		this.$el.hide();
		    	}
		    	$(window).resize();
		    }
		});
	
		var CommentView = Backbone.View.extend({
		    className: 'comment',
		    events: {
		        'click a.comment-remove': 'removeOne',
		    },
		    initialize: function() {
		        this.listenTo(this.model, 'destroy', this.remove);
		    },
		    render: function() {
		        this.$el.html(_.template(templateComment, this.model.toJSON()));
		        return this;
		    },
		    // Remove the comment item
		    removeOne: function(e) {
		        this.model.destroy();
		    	$(window).resize();
		        e.preventDefault();
		    }
		});
	
		var CommentsView = Backbone.View.extend({
		    className: 'post-comments',
		    events: {
		        'keypress textarea.add-comment': 'createOnEnter',
		    },
		    initialize: function() {
		        this.listenTo(this.model, 'add', this.addOne);
		        this.listenTo(this.model, 'reset', this.addAll);
		        this.listenTo(App.login, 'change', this.render);
		        
		        this.render();
		    },
		    render: function() {
		    	this.$el.html(_.template(templateComments));
		        this.input = this.$('.add-comment');
		    	return this;
		    },
		    addOne: function(comment) {
		        var view = new CommentView(_.extend(this.options, { model: comment }));
		        this.$el.find(".post-comment-input").before(view.render().el);
		    	$(window).resize();
		    },
		    addAll: function() {
		    	this.model.each(this.addOne, this);
		    },
		    createOnEnter: function(e) {
		        if (e.keyCode != 13) return;
		        if (!this.input.val().trim()) return;

		        /* 블로그 정보메뉴가 숨겨져 있을때만 토글한다. */
		        if (this.$el.parents('.post').find('.post-info-item i').hasClass('icon-plus')) {
		        	this.options.parent.toolbar.toggleInfo();
		        }
		        this.model.create({
		            author: {
		            	id:       App.login.get('id'),
		            	name:     App.login.get('name'),
		            	username: App.login.get('username'),
		            },
		            comment: this.input.val(),
		        	posted: '',
		        }, {wait: true});
		        this.input.val('');
		        e.preventDefault();
		    },
		});
	
		var ToolbarView = Backbone.View.extend({
			className: 'post-bar navbar',
			template: _.template($('#toolbarTemplate').html()),
		    events: {
		    	'click a.comment-button': 'eventHandler',
		    	'click a.like-button': 'eventHandler',
		    	'click a.toggle-button': 'eventHandler',
		    },
		    initialize: function(options) {
		    	this.listenTo(this.model, 'loaded', function() {
		    		this.isLike = this.model.likes.get(App.login) ? true : false;
		    		this.render();
		    	});
		    	this.listenTo(this.model.comments, 'add remove', this.render);
		    },
			render: function(model) {
				this.$el.html(_.template(templateToolbar, _.extend(this.model.toJSON(), {
					commentsLen: this.model.comments.length,
					likesLen: this.model.likes.length,
					isLike: this.isLike,
				})));
				return this;
			},
			eventHandler: function(e) {
				var $target = $(e.currentTarget);  
				if ($target.hasClass('comment-button')) {
					if ($target.parents('.post-bar').find('.post-info-item i').hasClass('icon-plus')) {
						this.toggleInfo();
					}
					$target.parents('.post').find('.add-comment').focus();
				} else if ($target.hasClass('like-button')) {
					this.toggleLike();
				} else if ($target.hasClass('toggle-button')) {
					this.toggleInfo();
				}
		        e.preventDefault();
			},
		    toggleLike: function() {
		    	this.isLike = !this.isLike;
		    	if (this.isLike) {
		        	this.model.likes.create(App.login.toJSON(), {wait: true});
		    	} else {
		    		me = this.model.likes.get(App.login);
		    		me.destroy();
		    	}
		    	this.render();
		    },
		    toggleInfo: function() {
		    	$post = this.$el.parents('.post'); 
		    	if (this.model.likes.length > 0) {
		        	$post.find('.post-likes').slideToggle('fast', function() {
		        		$(window).resize();
		        	});
		    	}
		    	if (this.model.comments.length > 0) {
		        	$post.find('.comment').slideToggle('fast', function() {
		        		$(window).resize();
		        	});
		    	}
		    	this.$el.find('.toggle-button i').toggleClass('icon-plus icon-minus');
		    },
		});
	
        var View = Backbone.View.extend({
        	className: 'post',
            events: {
            	'click a.post-remove': 'removeOne',
            },
            initialize: function(options) {
            	this.options.parent = this;
            	this.toolbar = new ToolbarView(_.extend(this.options, {model: this.model}));
            	this.likes = new LikesView(_.extend(this.options, {model: this.model.likes}));
            	this.comments = new CommentsView(_.extend(this.options, {model: this.model.comments}));

            	this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'destroy', this.remove);
                this.listenTo(this.model, 'loaded', function() {
    		    	if (this.options.list) {
    		    		var that = this; 
    		    		_.delay(function(){ that.toolbar.toggleInfo.call(that.toolbar); }, 0);
    		    	}
                });
            },
            render: function() {
            	if (this.options.list) {
                	this.$el.html(_.template(templateBlogThumb, this.model.toJSON()));
            	} else {
                	this.$el.html(_.template(templateBlogView, this.model.toJSON()));
            	}
            	this.$el.append(this.toolbar.$el);
            	this.$el.append(this.likes.$el);
            	this.$el.append(this.comments.$el);
            	return this;
            },
            removeOne: function(e) {
                this.model.destroy();
                e.preventDefault();
            },
        });
        
        return View;
	}

);