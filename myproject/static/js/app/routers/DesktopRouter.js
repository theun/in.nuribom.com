// DesktopRouter.js
// ----------------
define(["jquery", "backbone", 
        "models/Blog",
        "models/Group",
        "views/GroupView",
        "views/MainView", 
        "views/SearchView", 
        "views/BlogsView",
        "views/BlogView"],
        
    function($, Backbone,
    		Blog,
    		Group,
    		GroupView,
    		MainView, 
    		SearchView, 
    		BlogsView, 
    		BlogView) {

        var DesktopRouter = Backbone.Router.extend({

            initialize: function() {
                // Framework
                this.mainView = new MainView();

                Backbone.Mediator.sub('login', this.start, this);
                console.log('DesktopRouter:initialized');
            },
            
            start: function() {
            	// Tells Backbone to start watching for hashchange events
                Backbone.history.start();
            },

            // All of your Backbone Routes (add more)
            routes: {
                
                // When there is no hash on the url, the home method is called
                '': 'index',
                'blog/:id': 'blogView',
                'group': 'blog',
                'group/': 'blog',
                'group/:id': 'group',
                'search/:query': 'search',
                
                // Default
                '*actions': 'defaultAction',
            },

            index: function() {
            	console.log('DesktopRouter.index()')
            	if (App.login) {
                	this.changePage('group');
            	} else {
            		$('#content').html('');
            	}
            },
            
            blog: function() {
            	this.content = new BlogsView({
            		page_size: 10,
            	});
            },
            
            blogView: function(id) {
            	$container = $('#content');
            	$container.html('<link rel="stylesheet" href="static/css/blog.css" type="text/css" />');
                this.content = new BlogView({ model: new Blog({id: id}) });
                this.content.listenTo(this.content.model, 'change', function() {
                    $container.append(this.$el);
                });
            },
            
            group: function(id) {
            	this.content = new GroupView({
            		model: new Group({id: id}),
            		page_size: 10,
            	});
            },
            
            search: function(query) {
            	console.log('DesktopRouter:search(%s)', query)
            	
            	this.content = new SearchView({
            		query: query,
            		page: 1,
            		page_size: 25,
            	});
            },
            
            defaultAction: function(actions) {
            	console.log('No route: ', actions);
            },
            
            changePage: function(path) {
            	console.log('DesktopRouter.chagePage("%s")', path);
            	this.navigate(path, {trigger: true});
            }
            
        });

        // Returns the DesktopRouter class
        return DesktopRouter;

    }

);