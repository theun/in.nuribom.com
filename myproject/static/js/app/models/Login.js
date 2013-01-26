// Login.js
// --------
define(["jquery", "backbone"],

    function($, Backbone) {

        // Creates a new Backbone Model class object
        var Model = Backbone.Model.extend({

        	idAttribute: 'id',

        	url: '/rest/login',

            // Default values for all of the Model attributes
            defaults: {

            },

            initialize: function() {
            	this.fetch({wait: true});
                this.on('change', function() {
                	Backbone.Mediator.pub('login', this);
                });
            },

            // Get's called automatically by Backbone when the set and/or save methods are called (Add your own logic)
            validate: function(attrs) {

            },

        });

        // Returns the Model class
        return Model;

    }

);