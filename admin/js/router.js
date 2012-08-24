/*
 * ROUTER
 */
(function(Router) {
	Router.Router = Backbone.Router.extend({
		routes : {
			'' : 'loginRoute',
			'screens' : 'screensRoute',
			'screeneditor/:screenid' : 'defaultRoute'
		},

		defaultRoute : function(screenid) {
			var userModule = application.module('user');
			var screenModule = application.module('screens');
			var user = new userModule.Model();
			/*var screen = new screenModule.Model({
				screenid : screenid
			});*/
			
			user.fetch({
				error : function() {
					appRouter.navigate("", {
						trigger : true,
						replace : true
					});
				}
			});
			var screeneditorModule = application.module('screeneditor');
			var screenEditorView = new screeneditorModule.View({
				model : user,
				screenid : screenid
			});
		},
		loginRoute : function() {
			var loginModule = application.module('login');
			var loginView = new loginModule.View();
		},
		screensRoute : function() {
			// alert(screenid);
			var screensModule = application.module('screens');
			screens = new screensModule.Collection();
			screens.fetch({
				error : function() {
					new Login.Router().navigate("", {
						trigger : true,
						replace : true
					});
				}
			});
			var userModule = application.module('user');
			user = new userModule.Model();
			user.fetch({
				error : function() {
					new Login.Router().navigate("", {
						trigger : true,
						replace : true
					});
				}
			});
			var screensModule = application.module('screens');
			var screensView = new screensModule.View({
				collection : screens,
				model : user
			});
		},
	});
})(application.module("router"));