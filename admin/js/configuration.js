/*
 * CONFIGURATION
 */
(function(Configuration) {
	// MODEL
	Configuration.Model = Backbone.Model.extend({
		initialize : function() {
			// console.log("Welcome to this world");
		}
	});

	// COLLECTION
	Configuration.Collection = Backbone.Collection
			.extend({
				model : Configuration.Model,
				url : 'http://localhost/backendAdmin/index.php/controller/turtle_configs/'
			});
})(application.module("configuration"));
