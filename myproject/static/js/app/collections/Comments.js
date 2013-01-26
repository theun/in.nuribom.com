// Comments.js
// -----------

define(["jquery", "underscore", "backbone", "models/Comment"],

  function($, _, Backbone, Comment) {

    // Creates a new Backbone Collection class object
    var Collection = Backbone.Collection.extend({

      // Tells the Backbone Collection that all of it's models will be of type Model (listed up top as a dependency)
      model: Comment,
      
      url: function() {
  		var base = _.result(this.parent, 'url') || urlError();
		return base + '/comment';
      },

      initialize: function(models, options) {
  		(options && options.parent) || optionsError('parent');
		this.parent = options.parent;
      }
    });

    // Returns the Model class
    return Collection;

  }

);
