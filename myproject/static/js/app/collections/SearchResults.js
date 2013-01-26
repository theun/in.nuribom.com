// SearchResults.js
// ----------------

define(["jquery","backbone","models/SearchResult"],

  function($, Backbone, SearchResult) {

    // Creates a new Backbone Collection class object
    var Collection = Backbone.Collection.extend({

      // Tells the Backbone Collection that all of it's models will be of type Model (listed up top as a dependency)
      model: SearchResult,
      
      url: function() {
    	  query = this.options.query;
    	  page  = this.options.page ? this.options.page : 1;
    	  url   = '/rest/search/' + query + '/' + page
    	  
    	  console.log(url);
    	  return url;
      },

      initialize: function(models, options) {
    	  console.log('SearchResults:initialize()', options);
    	  this.options = options;
      }
    });

    // Returns the Model class
    return Collection;

  }

);