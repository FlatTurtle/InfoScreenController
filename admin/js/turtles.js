/*
 * TURTLES
 */
(function(Turtles) {
// MODEL
Turtles.Model = Backbone.Model.extend({
	initialize : function() {
		//console.log("Welcome to this world");
	}
});

// COLLECTION
Turtles.Collection = Backbone.Collection
		.extend({
			model : Turtles.Model,
			//url :'http://localhost/backendAdmin/index.php/controller/turtles/'+this.screen.get('screenid'),
			initialize : function(options) {
				this._order_by_id = this.comparator;

				this.url = 'http://localhost/backendAdmin/index.php/controller/turtles/'
						+ options.screen.get('screenid');
			},
			comparator : function(model) {
				return model.get('group') * 100 + model.get('order');
			}
		});

// VIEW
Turtles.View = Backbone.View.extend({
	el : '#appScreen',

	initialize : function(options) {
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

			$.each($('.addTurtle'), function() {
				// console.log('events');
				var el = $(this).get(0);
				el.addEventListener('dragover', self.handleDragOver, false);
				el.addEventListener('drop', self.handleDrop, false);
			});
			$.each($('.turtle'),
					function() {
						//var el = $(this).get(0);
						this.addEventListener('dragstart',
								self.handleDragStart, false);
						this.addEventListener('dragover', self.handleDragOver,
								false);
						this.addEventListener('dragend', self.handleDragEnd,
								false);
						this.addEventListener('drop', self.handleDrop, false);
					});
			$.each($('.newColumn'), function() {
				//console.log('events');
				var el = $(this).get(0);
				el.addEventListener('dragover', self.handleDragOver, false);
				el.addEventListener('drop', self.handleDrop, false);
			});
			$('.turtle').click(
					function() {
						var model = self.collection
								.getByCid($(this).attr('id'));
						for (x in self.collection.models) {
							if (self.collection.models[x].get('group') == model
									.get('group'))
								self.collection.models[x].set({
									selected : false
								});
						}
						model.set({
							selected : true
						});

					});

		}
	},

	handleDragStart : function(e) {
		// Target (this) element is the source node.
		console.log('drag');
		console.log(this);
		//$(this).css('opacity', '0.4');

		dragSrcEl = this;

		//e.dataTransfer.effectAllowed = 'move';
		//e.dataTransfer.setData('text/html', this.innerHTML);

		var turtleModel = turtles.getByCid($(this).attr('id'));
		$.each($('.addTurtle'), function() {
			if (parseInt($(this).attr('id').replace('add', '')) != turtleModel
					.get('group'))
				$(this).css('display', 'inline');
		});
		$.each($('.newColumn'), function() {
			$(this).css('display', 'inline');
		});
	},

	handleDragEnd : function() {
		//console.log('end');
		$(this).css('opacity', '1');
		$.each($('.addTurtle'), function() {
			$(this).css('display', 'none');
		});
		$.each($('.newColumn'), function() {
			$(this).css('display', 'none');
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
		e.preventDefault();

		if ($(this).hasClass('addTurtle') && $(dragSrcEl).hasClass('module')) {
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
			var group = $(this).attr('id').replace('add', '');
			var turtle = turtles.getByCid($(dragSrcEl).attr('id'));
			var arrayGroup = turtles.where({
				group : group
			});
			console.log(turtles.toJSON());
			var groupSize = arrayGroup.length;
			var colspan = arrayGroup[0].get('colspan');
			turtle.set({
				group : group,
				order : groupSize,
				colspan : colspan
			});
		} else if ($(this).hasClass('newColumn')
				&& $(dragSrcEl).hasClass('turtle')) {
			var turtle = turtles.getByCid($(dragSrcEl).attr('id'));
			var groupAmount = 0;
			for (x in turtles.models) {
				if (turtles.models[x].get('group') > groupAmount)
					groupAmount = turtles.models[x].get('group');
			}
			groupAmount++;
			turtle.set({
				group : groupAmount,
				order : 0,
				colspan : 1
			});
		}
		turtles.sort();
	}
});
})(application.module("turtles"));
