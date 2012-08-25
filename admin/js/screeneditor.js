/*
 * screeneditor  structure loading
 * Author: Glenn Bostoen
 */
(function(Screeneditor) {
	//dependencies
	var modulesModule = application.module('modules');
	var turtlesModule = application.module('turtles');
	var tasksModule = application.module('tasks');
	var userModule = application.module('user');
	var screenModule = application.module('screens');
	var screeneditorModule = application.module('screeneditor');
	var loginModule = application.module('login');
	
	
	
Screeneditor.View = Backbone.View.extend({
	el : $('body'),

	initialize : function(options) {
		_.bindAll(this, "render");
		this.model.bind("change", this.render);
		this.model.bind("reset", this.render);
		this.model.bind("add", this.render);

		this.screenid = options.screenid;
		console.log(this.screenid);

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
			//render modules
			
			var modules = new modulesModule.Collection();
			modules.fetch();
			var view2 = new modulesModule.View({
				collection : modules
			});
			
			//render turtles
			
			var turtles = new turtlesModule.Collection({
				screenid : this.screenid
			});
			turtles.fetch({
				success : function() {
					for (x in turtles.models) {
						if (turtles.models[x].get('order') == 0)
							turtles.models[x].set({order : parseInt(turtles.models[x].get('order')),group : parseInt(turtles.models[x].get('group')),selected:true});
						else
							turtles.models[x].set({order : parseInt(turtles.models[x].get('order')),group : parseInt(turtles.models[x].get('group')),selected:false});
					}
					console.log(turtles.toJSON());
				}
			});
			view = new turtlesModule.View({
				collection : turtles,
				modules: modules
			});
			
			
			
			var tasks = new tasksModule.Collection({
				screenid : this.screenid
			});
			tasks.fetch();
			var view3 = new tasksModule.View({
				collection : tasks
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
				console.log(xhr.status + ' ' + textStatus);
				username = data;
				new Screeneditor.Router().navigate("", {
					trigger : true
				});
			},
			error : function(xhr, ajaxOptions, thrownError) {
				console.log(xhr.status);
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
		
		var screenEditorView = new screeneditorModule.View({
			model : user,
			screen : screen
		});
	},
	loginRoute : function() {
		var loginView = new loginModule.View();
	},
	screensRoute : function() {
		// alert(screenid);
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
})(application.module("screeneditor"));