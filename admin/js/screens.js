/*
 * SCREENS
 */
(function(Screens) {
	/*
	 * MODEL
	 */
	Screens.Model = Backbone.Model.extend({
		
	});

	/*
	 * COLLECTION
	 */
	Screens.Collection = Backbone.Collection.extend({
		model : Screens.Model,
		url : 'http://localhost/backendAdmin/index.php/controller/screens'
	});

	Screens.View = Backbone.View.extend({
		el : 'body',
		initialize : function() {
			_.bindAll(this, "render");
			this.model.bind("change", this.render);
			this.model.bind("reset", this.render);
			this.model.bind("add", this.render);
			this.collection.bind("change", this.render);
			this.collection.bind("reset", this.render);
			this.collection.bind("add", this.render);

			var self = this;
			if (this.template == null) {
				$.get("screens.html", function(template) {
					self.template = template;
					self.render();
				});
			}
		},
		render : function() {
			var self = this;
			if (this.template) {
				var data = {
					screens : this.collection.models,
					username : this.model.get('username')
				};

				// add html to container
				this.$el.html($.tmpl(this.template, data));

				$('.screenbtn').click(function() {
					var model = self.collection.getByCid($(this).attr('id'));
					new Screens.Router().navigate("screeneditor/" + model.get('id'), {
						trigger : true,
						replace : true
					});
				});
			}
		}
	});

	Screens.Router = Backbone.Router.extend({
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
})(application.module("screens"));