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
	var modules, turtles, view, view2;
	var dragSrcEl;
	var App = {
		Models : {},
		Collections : {},
		Views : {},
		Templates : {}
	};

	/*
	 * MODULES
	 */

	// MODEL
	App.Models.Module = Backbone.Model.extend({
	});

	// COLLECTION
	App.Collections.Modules = Backbone.Collection.extend({
		model : App.Models.Module,
		url : 'http://localhost/serveradmin/index.php/controller/modules'
	});

	// VIEW
	App.Views.Modules = Backbone.View.extend({
		el : $('#appModules'),
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
							console.log('events');
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
			console.log('drag');

			$(this).css('opacity', '0.4');

			dragSrcEl = this;

			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/html', this.innerHTML);

			$.each($('.addTurtle'), function() {
				$(this).css('visibility', 'visible');
			});

		},

		handleDragOver : function(e) {
			console.log($(this).attr('id'));
			if (e.preventDefault) {
				e.preventDefault(); // Necessary. Allows us to drop.
			}

			e.dataTransfer.dropEffect = 'move'; // See the section on the
			// DataTransfer object.

			return false;
		},

		handleDragEnd : function() {
			console.log('end');
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
			console.log("Welcome to this world");
		}
	});

	// COLLECTION
	App.Collections.Turtles = Backbone.Collection.extend({
		model : App.Models.Turtle,
		url : 'http://localhost/serveradmin/index.php/controller/turtles/9',
		init : function(){
			console.log('length collection '+this.length);
			/*for(x in this.models){
				if(this.models[x].get('order') == 0) this.models[x].set({})
			}*/
		},
		initialize : function() {
			this._order_by_id = this.comparator;
			_.bindAll(this, 'init');
			this.bind('reset', this.init);
			console.log('length collection'+this.length);
		},
		comparator : function(model) {
			return model.get('group') * 100 + model.get('order');
		}
	});

	// VIEW
	App.Views.Turtles = Backbone.View.extend({
		el : $('#appScreen'),

		initialize : function() {
			console.log("Alerts suck.");
			_.bindAll(this, "render");
			// refresh view when collection changes. Is needed because fetch is
			// async
			this.collection.bind("reset", this.render);
			this.collection.bind('add', this.render);
			this.collection.bind('change', this.render);

			var self = this;
			if (this.template == null) {
				$.get("turtles.html", function(template) {
					self.template = template;
					self.render();
				});
			}
		},

		render : function() {
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
				console.log(this.collection.length);

				$
						.each($('.addTurtle'),
								function() {
									console.log('events');
									var el = $(this).get(0);
									el.addEventListener('dragover',
											self.handleDragOver, false);
									el.addEventListener('drop',
											self.handleDrop, false);
								});
				$
						.each($('.turtle'),
								function() {
									console.log('events');
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
			console.log('drag');

			$(this).css('opacity', '0.4');

			dragSrcEl = this;

			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/html', this.innerHTML);
			
			var turtleModel = turtles.getByCid($(this).attr('id'));
			$.each($('.addTurtle'), function() {	
				if($(this).attr('id').replace('add','') !=  turtleModel.get('group')) $(this).css('visibility', 'visible');
			});
		},

		handleDragEnd : function() {
			console.log('end');
			$(this).css('opacity', '1');
			$.each($('.addTurtle'), function() {
				$(this).css('visibility', 'visible');
			});
		},

		handleDragOver : function(e) {
			console.log($(this).attr('id'));
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
			if ($(this).hasClass('addTurtle') && $(dragSrcEl).hasClass('module')) {
				console.log('drop');
				var alias = $(dragSrcEl).attr('id');
				var pos = parseInt($(this).attr('id').replace('add', ''));
				console.log(alias);
				console.log(pos);
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
				console.log(turtles.toJSON());
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

				console.log(turtles.toJSON());
			}
			else if($(this).hasClass('addTurtle') && $(dragSrcEl).hasClass('turtle')){
				var group = parseInt($(this).attr('id').replace('add',''));
				//alert(group);
				var turtle = turtles.getByCid($(dragSrcEl).attr('id'));
				var arrayGroup = turtles.where({group:group});
				var groupSize = arrayGroup.length;
				var colspan = arrayGroup[0].get('colspan');
				turtle.set({group:group,order:groupSize,colspan:colspan});
			}
			turtles.sort();
		}
	});

	/*
	 * ROUTER
	 */
	var Router = Backbone.Router.extend({
		routes : {
			"" : "defaultRoute"
		},

		defaultRoute : function() {
			console.log("defaultRoute");
			// console.log(movies.length)
			turtles = new App.Collections.Turtles();
			turtles.fetch();
			view = new App.Views.Turtles({
				collection : turtles
			});

			modules = new App.Collections.Modules();
			modules.fetch();
			view2 = new App.Views.Modules({
				collection : modules
			});
		}
	})

	var appRouter = new Router();
	Backbone.history.start();

})(jQuery);