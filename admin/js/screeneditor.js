/*
 * SCREENEDITOR VIEW
 */
(function(Screeneditor) {
Screeneditor.View = Backbone.View.extend({
	el : $('body'),

	initialize : function(options) {
		//console.log("Alerts suck.");
		_.bindAll(this, "render");
		this.model.bind("change", this.render);
		this.model.bind("reset", this.render);
		this.model.bind("add", this.render);

		this.screen = options.screen;

		var self = this;
		if (this.template == null) {
			$.get("structurescreeneditor.html", function(template) {
				self.template = template;
				self.render();
			});
		}
	},
	render : function() {
		//alert(this.model.get('username'));
		var self = this;
		if (this.template) {
			var data = {
				username : this.model.get('username')
			};

			// add html to container
			this.$el.html($.tmpl(this.template, data));

			//rendered!!
			var turtlesModule = application.module('turtles');
			turtles = new turtlesModule.Collection({
				screen : this.screen
			});
			turtles.fetch({
				success : function() {
					for (x in turtles.models) {
						if (turtles.models[x].get('order') == '0')
							turtles.models[x].set({
								selected : true
							});
						else
							turtles.models[x].set({
								selected : false
							});
					}
					console.log(turtles.toJSON());
				}
			});
			view = new turtlesModule.View({
				collection : turtles
			});
			var modulesModule = application.module('modules');
			var modules = new modulesModule.Collection();
			modules.fetch();
			view2 = new modulesModule.View({
				collection : modules
			});

		}
	},
	events : {
		'click #logout' : 'logout'
	},
	logout : function() {
		$.ajax({
			url : 'http://localhost/backendAdmin/index.php/controller/logout',
			type : "GET",
			success : function(data, textStatus, xhr) {
				//console.log('success');
				//console.log(xhr.status + ' ' + textStatus);
				username = data;
				new Screeneditor.Router().navigate("", {
					trigger : true,
					replace : true
				});
			},
			error : function(xhr, ajaxOptions, thrownError) {
				//console.log('fail');
				//console.log(xhr.status);
			}
		});
	}
});
Screeneditor.Router = Backbone.Router.extend({
	routes : {
		'' : 'loginRoute',
		'screens' : 'screensRoute',
		'screeneditor/:screenid' : 'defaultRoute'
	},

	defaultRoute : function(screenid) {
		var userModule = application.module('user');
		var screenModule = application.module('screens');
		var user = new userModule.Model();
		var screen = new screenModule.Model({
			screenid : screenid
		});
		
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
			screen : screen
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
})(application.module("screeneditor"));