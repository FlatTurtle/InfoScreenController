/*
 * 
 * Author: Glenn Bostoen
 */
(function(Tasks) {
	
	//dependencies
	var dialogModule = application.module('dialog');
	
// MODEL
	Tasks.Model = Backbone.Model.extend({});

// COLLECTION
	Tasks.Collection = Backbone.Collection.extend({
		model : Tasks.Model,
		initialize: function(options){
			this.url = 'http://localhost/backendAdmin/index.php/controller/tasks/'+options.screenid;
			this.screenid = options.screenid;
		}
	});
	
	Tasks.Tasks_possible = Backbone.Collection.extend({
		url: 'http://localhost/backendAdmin/index.php/controller/tasks_possible/',
		model : Tasks.Model
	});

// VIEW
	Tasks.View = Backbone.View.extend({
		el : '#appTasks',
		initialize : function(options) {
			_.bindAll(this, "render");
			_.bindAll(this, "checkClick");
			_.bindAll(this, "taskClick");
			_.bindAll(this, "addClick");
			_.bindAll(this, "removeClick");

			this.collection.bind("reset", this.render);
			this.collection.bind('add', this.render);
			this.collection.bind('change', this.render);
			var self = this;

			if (this.template == null) {
				$.get("tasks.html", function(template) {
					self.template = template;
					self.render();
				});
			}
		},
		render : function() {
			var self = this;
			if (this.template) {
				var data = {
						tasks : this.collection.models
				};
				// add html to container
				this.$el.html($.tmpl(this.template, data));

				// notify listeners render completed and pass element
				this.trigger("rendered", this.$el);
			}
		},
		events:{
			"click .addTask" : 'addClick',
			"click .removeTask" : 'removeClick',
			"click .checkbox" : 'checkClick',
			"click .task" : 'taskClick'
		},
		addClick: function(e){
			var model = new Tasks.Model();
			var collection = new Tasks.Tasks_possible();
			collection.fetch();
			model.set({dialog: 'insertTask'});
			var dialog = new dialogModule.View({model: model,collection:collection,screenid:this.collection.screenid,scheduled_tasks: this.collection});
			$('body').append(dialog.el);
		},
		removeClick: function(e){
			var self = this;
			var id = $(e.target).parent('td').parent('tr').attr('id');
			var model = this.collection.getByCid(id);
			this.collection.remove(model);
			
			$.ajax({
				url : 'http://localhost/backendAdmin/index.php/controller/task_remove',
				type : 'POST',
				data : {
					task: model.toJSON()
				},
				success : function(data, textStatus, xhr) {
					console.log('success');
					self.collection.fetch();
				},
				error : function(xhr, ajaxOptions, thrownError) {
					console.log('fail');
					console.log(xhr.status);
				}
			});
			
		},
		
		checkClick: function(e){
			var self = this;
			var id = $(e.target).parent('td').parent('tr').attr('id');
			var model = this.collection.getByCid(id);
			var activated = (parseInt(model.get('activated'))+1)%2;
			console.log(model.toJSON());
			model.set({activated : activated});
			console.log(model.toJSON());

			// save to db activated or not
			$.ajax({
				url : 'http://localhost/backendAdmin/index.php/controller/tasks',
				type : 'POST',
				data : {
					tasks: self.collection.toJSON()
				},
				success : function(data, textStatus, xhr) {
					console.log('success');
				},
				error : function(xhr, ajaxOptions, thrownError) {
					console.log('fail');
					console.log(xhr.status);
				}
			});
		},
		taskClick : function(e){
			var dialogModule = application.module('dialog');
			var id = $(e.target).parent('td').parent('tr').attr('id');
			var model = this.collection.getByCid(id);
			model.set({dialog: 'task'});
			var dialog = new dialogModule.View({model: model});
			$('body').append(dialog.el);
		}

	});
})(application.module("tasks"));