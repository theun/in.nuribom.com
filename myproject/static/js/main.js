require.config({
	baseUrl: '/static/js',
	
	paths: {
		// Core Libraries
		// --------------
		jquery: 'libs/jquery',
		jqueryui: 'libs/jqueryui',
		underscore: 'libs/underscore',
		backbone: 'libs/backbone',
		
		// Plugins
		// -------
		bootstrap: 'libs/plugins/bootstrap',
		text: 'libs/plugins/text',
		
		// Application Folders
		// -------------------
		collections: 'app/collections',
		models: 'app/models',
		routers: 'app/routers',
		templates: 'app/templates',
		views: 'app/views'
	},

	shim: {
		bootstrap: ['jquery'],
		jqueryui: ['jquery'],
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'backbone.validateAll': ['backbone']
	}
});

require([
    'app',
], function(App) {
	App.initialize();
});