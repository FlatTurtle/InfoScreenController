/*
 * Main application
 * Author: Glenn Bostoen
 */
var application = {
	// Create this closure to contain the cached modules
	module : function() {
		// Internal module cache.
		var modules = {};

		// Create a new module reference scaffold or load an
		// existing module.
		return function(name) {
			// If this module has already been created, return it.
			if (modules[name]) {
				return modules[name];
			}

			// Create a module and save it under this name
			return modules[name] = {
				Views : {}
			};
		};
	}()
};

// new template function
//needed for creating a for loop in html templ
(function($) {
	$.extend(jQuery.tmpl.tag, {
		"for" : {
			_default : {
				$2 : "var i=1;i<=1;i++"
			},
			open : 'for ($2){',
			close : '};'
		}
	});
})(jQuery);

// Using the jQuery ready event is excellent for ensuring all
// code has been downloaded and evaluated and is ready to be
// initialized. Treat this as your single entry point into the
// application.

//startup of router
jQuery(function($) {
	/*var routerModule = application.module('router');
	application.router = new routerModule.Router();
	Backbone.history.start();*/
});