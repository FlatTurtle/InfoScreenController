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
			initialize : function(options) {
				this._order_by_id = this.comparator;
				this.url = 'http://localhost/backendAdmin/index.php/controller/turtles/'
						+ options.screenid;
				this.screenid = options.screenid;
			},
			comparator : function(model) {
				return model.get('order');
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
		
		Turtles.modules = options.modules;
		Turtles.turtles = options.collection;

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
			var turtles = Turtles.turtles;
			var colCount = 0;
			for (x in turtles.models) {
				if (turtles.models[x].get('group') > colCount)
					colCount = turtles.models[x].get('group');
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
			/*$.each($('.column'),function(){
				var airportModule = application.module('airport');
				var collection = new airportModule.Collection({},{location: 'BRU'});
				collection.fetch();
				var view = new airportModule.View({collection : collection});
				view.setElement($(this));
			})*/
			
			var editscreenModule = application.module('editscreen');
			var editscreen = new editscreenModule.Model();
			editscreen.fetch({data : {screenid : this.collection.screenid},success:function(){
				//console.log(editscreen.toJSON());
			}});
			//console.log(editscreen.get('title'));
			var editscreenView = new editscreenModule.View({model: editscreen});

		}
	},

	handleDragStart : function(e) {
		var turtles = Turtles.turtles;
		// Target (this) element is the source node.
		//console.log('drag');
		//console.log(this);
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
		var turtles = Turtles.turtles;
		var modules = Turtles.modules;
		// this/e.target is current target element.
		// alert(this.id);
		if (e.stopPropagation) {
			e.stopPropagation(); // Stops some browsers from redirecting.
		}
		e.preventDefault();

		if ($(this).hasClass('addTurtle') && $(dragSrcEl).hasClass('module')) {
			var module = modules.getByCid($(dragSrcEl).attr('id'));
			var pos = parseInt($(this).attr('id').replace('add', ''));
			var size = turtles.where({group: pos}).length;
			var turtle = {
				"module_alias" : module.get('alias'),
				"image" : module.get('image'),
				"group" : pos,
				"order" : size,
				"screen_id": turtles.screenid, 
				"colspan" : 1
			};
			turtles.add(turtle);
			$.ajax({
				url : 'http://localhost/backendAdmin/index.php/controller/turtle',
				type : 'POST',
				data : {
					turtle: turtle
				},
				success : function(data, textStatus, xhr) {
					console.log(turtle);
					console.log('success');
					//console.log(xhr.status + ' ' + textStatus);
				},
				error : function(xhr, ajaxOptions, thrownError) {
					console.log('fail');
					console.log(xhr.status);
				}
			});
			//fetching turtles
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
				group : model2.get('group'),
				order : model2.get('order'),
				colspan : model2.get('colspan'),
				selected: model2.get('selected')
			});
			turtles.getByCid($(dragSrcEl).attr('id')).set({
				group : model1JSON.group,
				order : model1JSON.order,
				colspan : model1JSON.colspan,
				selected: model1JSON.selected
			});

			//console.log(turtles.toJSON());
		} else if ($(this).hasClass('addTurtle')
				&& $(dragSrcEl).hasClass('turtle')) {
			var group = parseInt($(this).attr('id').replace('add', ''));
			var turtle = turtles.getByCid($(dragSrcEl).attr('id'));
			var arrayGroup = turtles.where({
				group : group
			});
			//console.log(turtles.toJSON());
			var originalGroupSize = turtles.where({
				group : turtle.get('group')
			}).length;
			var originalGroupNumber = turtle.get('group');
			
			var groupSize = arrayGroup.length;
			var colspan = arrayGroup[0].get('colspan');
			turtle.set({
				group : group,
				order : groupSize,
				colspan : colspan
			});
			
			
			if(originalGroupSize == 1){
				for(x in turtles.models){
					var groupnr = turtles.models[x].get('group');
					var groupnr = groupnr - 1;
					if(turtles.models[x].get('group') > originalGroupNumber) turtles.models[x].set({group : groupnr});
				}
			}
			for(x in turtles.models){
				console.log(turtles.models[x].toJSON());
			}
		} else if ($(this).hasClass('newColumn')
				&& $(dragSrcEl).hasClass('turtle')) {
			var turtle = turtles.getByCid($(dragSrcEl).attr('id'));
			
			var originalGroupSize = turtles.where({
				group : turtle.get('group')
			}).length;
			var originalGroupNumber = turtle.get('group');
			
			var groupAmount = 0;
			for (x in turtles.models) {
				if (turtles.models[x].get('group') > groupAmount)
					groupAmount = turtles.models[x].get('group');
			}
			groupAmount++;
			turtle.set({
				group : groupAmount,
				order : 0,
				colspan : 1,
				selected:true
			});
			
			if(originalGroupSize == 1){
				for(x in turtles.models){
					var groupnr = turtles.models[x].get('group');
					var groupnr = groupnr - 1;
					if(turtles.models[x].get('group') > originalGroupNumber) turtles.models[x].set({group : groupnr});
				}
			}
		}
		turtles.sort();
		for(x in turtles.models){
			console.log(turtles.models[x].toJSON());
		}
		for(x in turtles.models){
			var group = turtles.where({group: turtles.models[x].get('group')});
			var groupSelected = turtles.where({selected: true,group: turtles.models[x].get('group')});
			if(groupSelected.length == 0){
				group[0].set({selected:true});
			}
			else if(groupSelected.length > 1){
				for(var i=1;i<groupSelected.length;i++) groupSelected[i].set({selected : false});
			}
			for(y in group){
				group[y].set({order: y});
			}
		}
		turtles.sort();
		
		if(!$(dragSrcEl).hasClass('module')){
			
		//save to database
		$.ajax({
			url : 'http://localhost/backendAdmin/index.php/controller/turtles',
			type : 'POST',
			data : {
				turtles: turtles.toJSON()
			},
			success : function(data, textStatus, xhr) {
				console.log(turtles.toJSON());
				console.log('success');
				//console.log(xhr.status + ' ' + textStatus);
			},
			error : function(xhr, ajaxOptions, thrownError) {
				console.log('fail');
				console.log(xhr.status);
			}
		});
		}
	}
});
Turtles.Router = Backbone.Router.extend({
	routes : {
		'' : 'loginRoute'
	},
	loginRoute : function() {
		var loginModule = application.module('login');
		var loginView = new loginModule.View();
	}
});
})(application.module("turtles"));
