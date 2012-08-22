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

(function($) {
	var modules, turtles, view, view2,user,dragSrcEl,screens,screen;
	var App = {
		Models : {},
		Collections : {},
		Views : {},
		Templates : {}
	};
	/*
	 * LOGIN
	 */
	App.Views.Login = Backbone.View.extend({
		el : 'body',
		initialize : function() {
			_.bindAll(this, "render");
			var self = this;
			if (this.template == null) {
				$.get("login.html", function(template) {
					self.template = template;
					self.render();
				});
			}
		},
		render : function() {
			if(this.template){
				var data = {};
				// add html to container
				this.$el.html($.tmpl(this.template, data));
			}
			
		},
		events: {
			'click #send' : 'submit'
		},
		submit : function(){
			//unsafe sending pass and name to backend except over https?
			var name = $('#login').val();
			var pass = $('#password').val();
			//console.log(name+pass);
			
			$.ajax({
                url : 'http://localhost/backendAdmin/index.php/controller/login',
                type : "POST",
                data : {
                    name : name,
                    pass : pass
                },
                success : function(data, textStatus, xhr) {
                	//console.log('success');
                    //console.log(xhr.status + ' ' + textStatus);
                    username = data;
                    appRouter.navigate("screens", {trigger: true, replace: true});
                },
                error : function(xhr, ajaxOptions, thrownError) {
                	//console.log('fail');
                    //console.log(xhr.status);
                }
            });
		}
	});

	/*
	 * MODULES
	 */

	// MODEL
	App.Models.Module = Backbone.Model.extend({});

	// COLLECTION
	App.Collections.Modules = Backbone.Collection.extend({
		model : App.Models.Module,
		url : 'http://localhost/backendAdmin/index.php/controller/modules'
	});

	// VIEW
	App.Views.Modules = Backbone.View.extend({
		el : '#appModules',
		initialize : function() {
			_.bindAll(this, "render");
			this.collection.bind("reset", this.render);
			var self = this;
			if (this.template == null) {
				$.get("modules.html", function(template) {
					self.template = template;
					self.render();
				});
			}
		},
		render : function() {
			var self = this;
			if (this.template) {
				var data = {
					modules : this.collection.toJSON()
				};
				// add html to container
				this.$el.html($.tmpl(this.template, data));

				$.each($('.module'),
						function() {
							//console.log('events');
							var el = $(this).get(0);
							el.addEventListener('dragstart',
									self.handleDragStart, false);
							el.addEventListener('dragover',
									self.handleDragOver, false);
							el.addEventListener('dragend', self.handleDragEnd,
									false);
						});

				// notify listeners render completed and pass element
				this.trigger("rendered", this.$el);
			}
		},
		handleDragStart : function(e) {
			// Target (this) element is the source node.
			//console.log('drag');

			$(this).css('opacity', '0.4');

			dragSrcEl = this;

			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/html', this.innerHTML);

			$.each($('.addTurtle'), function() {
				$(this).css('visibility', 'visible');
			});

		},

		handleDragOver : function(e) {
			//console.log($(this).attr('id'));
			if (e.preventDefault) {
				e.preventDefault(); // Necessary. Allows us to drop.
			}

			e.dataTransfer.dropEffect = 'move'; // See the section on the
			// DataTransfer object.

			return false;
		},

		handleDragEnd : function() {
			//console.log('end');
			$.each($('.addTurtle'), function() {
				$(this).css('visibility', 'collapse');
			});
			$(this).css('opacity', '1');
		}
	});

	/*
	 * TURTLES
	 */
	// MODEL
	App.Models.Turtle = Backbone.Model.extend({
		initialize : function() {
			//console.log("Welcome to this world");
		}
	});

	// COLLECTION
	App.Collections.Turtles = Backbone.Collection.extend({
		model : App.Models.Turtle,
		//url :'http://localhost/backendAdmin/index.php/controller/turtles/'+this.screen.get('screenid'),
		initialize : function(options) {
			this._order_by_id = this.comparator;
			
			
			this.url = 'http://localhost/backendAdmin/index.php/controller/turtles/'+options.screen.get('screenid');
		},
		comparator : function(model) {
			return model.get('group') * 100 + model.get('order');
		}
	});

	// VIEW
	App.Views.Turtles = Backbone.View.extend({
		el : '#appScreen',

		initialize : function(options) {
			_.bindAll(this, "render");
			// refresh view when collection changes. Is needed because fetch is
			// async
			this.collection.bind("reset", this.render);
			this.collection.bind('add', this.render);
			this.collection.bind('change', this.render);
			
			
			this.screen = options.screen;

			var self = this;
			if (this.template == null) {
				$.get("turtles.html", function(template) {
					self.template = template;
					self.render();
				});
			}
		},

		render : function() {
			//alert(this.el.toJSON());
			var self = this;
			if (this.template) {
				var turtles = this.collection.toJSON();
				var colCount = 0;
				for (x in turtles) {
					if (turtles[x].group > colCount)
						colCount = turtles[x].group;
				}
				var data = {
					turtles : this.collection.models,
					columns : colCount
				};

				// add html to container
				this.$el.html($.tmpl(this.template, data));

				// notify listeners render completed and pass element
				this.trigger("rendered", this.$el);
				//console.log(this.collection.length);

				$
						.each($('.addTurtle'),
								function() {
									//console.log('events');
									var el = $(this).get(0);
									el.addEventListener('dragover',
											self.handleDragOver, false);
									el.addEventListener('drop',
											self.handleDrop, false);
								});
				$
						.each($('.turtle'),
								function() {
									//console.log('events');
									var el = $(this).get(0);
									el.addEventListener('dragstart',
											self.handleDragStart, false);
									el.addEventListener('dragover',
											self.handleDragOver, false);
									el.addEventListener('dragend',
											self.handleDragEnd, false);
									el.addEventListener('drop',
											self.handleDrop, false);
								});
			}
		},

		handleDragStart : function(e) {
			// Target (this) element is the source node.
			//console.log('drag');

			$(this).css('opacity', '0.4');

			dragSrcEl = this;

			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/html', this.innerHTML);

			var turtleModel = turtles.getByCid($(this).attr('id'));
			$.each($('.addTurtle'), function() {
				if ($(this).attr('id').replace('add', '') != turtleModel
						.get('group'))
					$(this).css('visibility', 'visible');
			});
		},

		handleDragEnd : function() {
			//console.log('end');
			$(this).css('opacity', '1');
			$.each($('.addTurtle'), function() {
				$(this).css('visibility', 'visible');
			});
		},

		handleDragOver : function(e) {
			//console.log($(this).attr('id'));
			if (e.preventDefault) {
				e.preventDefault(); // Necessary. Allows us to drop.
			}

			e.dataTransfer.dropEffect = 'move'; // See the section on the
			// DataTransfer object.

			return false;
		},
		handleDrop : function(e) {
			// this/e.target is current target element.
			// alert(this.id);
			if (e.stopPropagation) {
				e.stopPropagation(); // Stops some browsers from redirecting.
			}
			if ($(this).hasClass('addTurtle')
					&& $(dragSrcEl).hasClass('module')) {
				//console.log('drop');
				var alias = $(dragSrcEl).attr('id');
				var pos = parseInt($(this).attr('id').replace('add', ''));
				//console.log(alias);
				//console.log(pos);
				var size = 0;
				var turtlesJSON = turtles.toJSON();
				for (x in turtlesJSON) {
					if (turtlesJSON[x].group == pos)
						size++;
				}
				var module;
				var modulesJSON = modules.toJSON();
				for (x in modulesJSON) {
					if (modulesJSON[x].alias == alias)
						module = modulesJSON[x];
				}
				var turtle = {
					"alias" : alias,
					"image" : module.image,
					"group" : pos,
					"order" : size,
					"colspan" : 1
				};
				turtles.add(turtle);
				//console.log(turtles.toJSON());
			} else if ($(this).hasClass('turtle')) {
				var first, second;
				var thisEl = this;
				$.each($('.turtle'), function(index) {
					if (this == thisEl)
						second = index;
					else if (dragSrcEl == this)
						first = index;
				});
				var model1, model2;
				model1 = turtles.getByCid($(this).attr('id'));
				model2 = turtles.getByCid($(dragSrcEl).attr('id'));
				var model1JSON = model1.toJSON();

				turtles.getByCid($(this).attr('id')).set({
					group : model2.toJSON().group,
					order : model2.toJSON().order,
					colspan : model2.toJSON().colspan
				});
				turtles.getByCid($(dragSrcEl).attr('id')).set({
					group : model1JSON.group,
					order : model1JSON.order,
					colspan : model1JSON.colspan
				});

				//console.log(turtles.toJSON());
			} else if ($(this).hasClass('addTurtle')
					&& $(dragSrcEl).hasClass('turtle')) {
				var group = parseInt($(this).attr('id').replace('add', ''));
				var turtle = turtles.getByCid($(dragSrcEl).attr('id'));
				var arrayGroup = turtles.where({
					group : group
				});
				var groupSize = arrayGroup.length;
				var colspan = arrayGroup[0].get('colspan');
				turtle.set({
					group : group,
					order : groupSize,
					colspan : colspan
				});
			}
			turtles.sort();
		}
	});
	
	/*
	 * user model
	 */
	App.Models.User = Backbone.Model.extend({
		url : 'http://localhost/backendAdmin/index.php/controller/user'
	});
	
	/*
	 * SCREENEDITOR VIEW
	 */

	App.Views.ScreenEditor = Backbone.View.extend({
		el : $('body'),

		initialize : function(options) {
			//console.log("Alerts suck.");
			_.bindAll(this, "render");
			this.model.bind("change", this.render);
			this.model.bind("reset", this.render);
			this.model.bind("add", this.render);
			
			this.screen =  options.screen;
			
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
						username: this.model.get('username')
				};

				// add html to container
				this.$el.html($.tmpl(this.template, data));
				
				
				console.log(this.screen.toJSON());	
				//rendered!!
				turtles = new App.Collections.Turtles({screen : this.screen});
				turtles.fetch();
				view = new App.Views.Turtles({
					collection : turtles,
					screen : this.screen
				});
				

				modules = new App.Collections.Modules();
				modules.fetch();
				view2 = new App.Views.Modules({
					collection : modules
				});

			}
		},
		events: {
			'click #logout' : 'logout'
		},
		logout: function() {
			$.ajax({
                url : 'http://localhost/backendAdmin/index.php/controller/logout',
                type : "GET",
                success : function(data, textStatus, xhr) {
                	//console.log('success');
                    //console.log(xhr.status + ' ' + textStatus);
                    username = data;
                    appRouter.navigate("", {trigger: true, replace: true});
                },
                error : function(xhr, ajaxOptions, thrownError) {
                	//console.log('fail');
                    //console.log(xhr.status);
                }
            });
		}
	});
	
	/*
	 * SCREENS
	 */
	
	/*
	 * MODEL
	 */
	App.Models.Screen = Backbone.Model.extend({
	});
	
	/*
	 * COLLECTION
	 */
	App.Collections.Screens = Backbone.Collection.extend({
		model: App.Models.Screen,
		url : 'http://localhost/backendAdmin/index.php/controller/screens'
	});
	
	App.Views.Screens = Backbone.View.extend({
		el: 'body',
		initialize: function(){
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
		render : function(){
			var self = this;
			if (this.template) {
				var data = {
						screens : this.collection.models,
						username: this.model.get('username')
				};

				// add html to container
				this.$el.html($.tmpl(this.template, data));
				
				$('.screenbtn').click(function(){
					var model = self.collection.getByCid($(this).attr('id'));
					appRouter.navigate("screeneditor/"+model.get('id'), {trigger: true, replace: true});
				});
			}
		}
	});
	
	/*
	 * ROUTER
	 */
	var Router = Backbone.Router.extend({
		routes : {
			'' : 'loginRoute',
			'screens' : 'screensRoute',
			'screeneditor/:screenid' : 'defaultRoute'
		},

		defaultRoute : function(screenid) {
			user = new App.Models.User();
			screen = new App.Models.Screen({screenid : screenid});
			user.fetch({error: function(){
				appRouter.navigate("", {trigger: true, replace: true});
			}});
			var screenEditorView = new App.Views.ScreenEditor({model : user , screen :  screen});
		},
		loginRoute : function() {
			var loginView = new App.Views.Login({});
		},
		screensRoute: function(){
			//alert(screenid);
			screens = new App.Collections.Screens();
			screens.fetch({error: function(){
				appRouter.navigate("", {trigger: true, replace: true});
			}});
			user = new App.Models.User();
			user.fetch({error: function(){
				appRouter.navigate("", {trigger: true, replace: true});
			}});
			var screensView = new App.Views.Screens({collection : screens,model:user});
		},
	});

	var appRouter = new Router();
	Backbone.history.start();

})(jQuery);