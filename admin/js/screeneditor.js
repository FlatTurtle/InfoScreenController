/*
 * screeneditor  structure loading
 * Author: Glenn Bostoen
 */
(function(Screeneditor) {
	//dependencies
	var modulesModule = application.module('modules');
	var turtlesModule = application.module('turtles');
	var tasksModule = application.module('tasks');
	var routerModule = application.module('router');
	var editscreenModule = application.module('editscreen');

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
				$('#appScreen').append(view.el);
				var tasks = new tasksModule.Collection({
					screenid : this.screenid
				});
				tasks.fetch();
				var view3 = new tasksModule.View({
					collection : tasks
				});
				
				var editscreen = new editscreenModule.Model();
				editscreen.fetch({data : {screenid : this.screenid},success:function(){}});
				var editscreenView = new editscreenModule.View({model: editscreen});

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
					new routerModule.Router().navigate("", {
						trigger : true
					});
				},
				error : function(xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
				}
			});
		}
	});
})(application.module("screeneditor"));