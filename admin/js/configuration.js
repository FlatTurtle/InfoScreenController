/*
 * Turtle configuration functionality
 * Author: Glenn Bostoen
 */
(function(Configuration) {
	// MODEL
	Configuration.Model = Backbone.Model.extend({});

	// COLLECTION
	Configuration.Collection = Backbone.Collection
			.extend({
				model : Configuration.Model,
				url : 'http://localhost/backendAdmin/index.php/controller/turtle_configs/'
			});
})(application.module("configuration"));
