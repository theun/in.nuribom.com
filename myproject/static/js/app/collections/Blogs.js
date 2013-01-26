// Blogs.js
// --------

define(["jquery", "underscore", "backbone", "models/Blog"],

  function($, _, Backbone, Blog) {

    // Creates a new Backbone Collection class object
    var Collection = Backbone.Collection.extend({

      // Tells the Backbone Collection that all of it's models will be of type Model (listed up top as a dependency)
      model: Blog,
      
      url: '/rest/blog',

      initialize: function(models, options) {}
    
    });

    // Returns the Model class
    return Collection;

  }

);
