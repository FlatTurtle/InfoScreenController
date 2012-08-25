/*
 * loading and visualizing of screens
 * Author: Glenn Bostoen
 */
(function(Screens) {
	//dependencies
	var screensModule = application.module('screens');
	var userModule = application.module('user');
	var loginModule = application.module('login');
	var screeneditorModule = application.module('screeneditor');
	
	/*
	 * MODEL
	 */
	Screens.Model = Backbone.Model.extend({});

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
			
			var user = new userModule.Model();
			user.fetch({
				error : function() {
					appRouter.navigate("", {
						trigger : true
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
						trigger : true
					});
				}
			});
			
			var user = new userModule.Model();
			user.fetch({
				error : function() {
					new Login.Router().navigate("", {
						trigger : true
					});
				}
			});
			
			var screensView = new screensModule.View({
				collection : screens,
				model : user
			});
		},
	});
})(application.module("screens"));