/*
 * Main Router
 * Author: Glenn Bostoen
 */
(function(Router) {
	//dependencies
	var userModule = application.module('user');
	var screenModule = application.module('screens');
	var screeneditorModule = application.module('screeneditor');
	var loginModule = application.module('login');
	var screensModule = application.module('screens');

	Router.Router = Backbone.Router.extend({
		routes : {
			'' : 'loginRoute',
			'screens' : 'screensRoute',
			'screeneditor/:screenid' : 'defaultRoute'
		},

		defaultRoute : function(screenid) {
			var user = new userModule.Model();

			user.fetch({
				error : function() {
					appRouter.navigate("", {
						trigger : true,
						replace : true
					});
				}
			});
			var screenEditorView = new screeneditorModule.View({
				model : user,
				screenid : screenid
			});
		},
		loginRoute : function() {
			var loginView = new loginModule.View();
		},
		screensRoute : function() {
			var screens = new screensModule.Collection();
			screens.fetch({
				error : function() {
					new Login.Router().navigate("", {
						trigger : true,
						replace : true
					});
				}
			});
			var user = new userModule.Model();
			user.fetch({
				error : function() {
					new Login.Router().navigate("", {
						trigger : true,
						replace : true
					});
				}
			});
			var screensView = new screensModule.View({
				collection : screens,
				model : user
			});
		},
	});
})(application.module("router"));