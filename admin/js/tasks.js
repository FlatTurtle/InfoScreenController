/*
 * MODULES
 */
(function(Tasks) {
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

// VIEW
Tasks.View = Backbone.View.extend({
	el : '#appTasks',
	initialize : function(options) {
		_.bindAll(this, "render");
		_.bindAll(this, "checkClick");
		_.bindAll(this, "taskClick");
		
		this.collection.bind("reset", this.render);
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
		"click .checkbox" : 'checkClick',
		"click .task" : 'taskClick'
	},
	checkClick: function(e){
		var self = this;
		var id = $(e.target).parent('td').parent('tr').attr('id');
		var model = this.collection.getByCid(id);
		var activated = (parseInt(model.get('activated'))+1)%2;
		console.log(model.toJSON());
		model.set({activated : activated});
		console.log(model.toJSON());
		
		//save to db
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
		
		
	}
	
});
})(application.module("tasks"));