// View.js
// -------
define(["jquery", "backbone", "models/Model", "models/Login", "text!templates/header.html", "text!templates/alarm.html"],
    function($, Backbone, Model, Login, templateHeader, templateAlarm) {

		var Alarm = Backbone.Model.extend({
			idAttribute: 'id',
		});
		
		var AlarmView = Backbone.View.extend({
		    render: function() {
		    	this.template = _.template(templateAlarm, this.model.toJSON());
		    	
		        this.el = this.template;
		        
		        return this;
		    },
		});
		
		var AlarmsView = Backbone.View.extend({
			tagName: 'ul',
			className: 'dropdown-menu pull-right',
			
			render: function(alarms, el) {
				this.$el.html('');
            	_.each(alarms, this.addAlarm, this);
				el.append(this.$el);
			},

            addAlarm: function(alarm) {
            	var view = new AlarmView({ model: new Alarm(alarm) });
            	this.$el.append(view.render().el);
            },
            
		});
		
		// Top Menu View
        var View = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#header",
            
            // View constructor
            initialize: function() {

            	Backbone.Mediator.sub('login', this.render, this);

                // Try remember me request. If success, the channel 'login' will be published.
                this.login = new Login();
            },

            // View Event Handlers
            events: {
            	'keypress #global-query': 'searchOnEnter',
            	'click input.btn': 'login',
            },

            // Renders the view's template to the UI
            render: function() {
            	// Setting the view's template property using the Underscore template method
                this.template = _.template(templateHeader, this.login.toJSON());
            	
                // Dynamically updates the UI with the view's template
                this.$el.html(this.template);
                if (!this.login.isNew()) {
                	App.login = this.login;
                    this.alarmsView = new AlarmsView;
                    
                    _.bindAll(this, 'searchQuery');
                    this.alarmsView.render(this.login.get('alarms'), this.$el.find('#alarms'));

	                this.search = $("#global-query");
	                
	                this.search.typeahead({
	                    source: function(query, process) {
	                        var url = "/search/prefix";
	                    	return $.get(url, { keyword: query }, function(data) {
	                    		var that = process(data);
	                    		that.$menu.find('.active').removeClass('active');
	                    		return that;
	                    	}, "json");
	                    },
	                });
                }

            	// Maintains chainability
                return this;

            },
            
            searchOnEnter: function(e) {
            	query = this.search.val();
            	if (e.keyCode != 13 || !query) return;
            	this.searchQuery(query);
            	e.preventDefault();
            },
            
            searchQuery: function(query) {
            	q = query.trim();
            	if (!q) return;
            	
            	App.changePage('search/' + q);
            },
            
        });

        // Returns the View class
        return View;

    }

);