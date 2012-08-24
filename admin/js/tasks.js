/*
 * MODULES
 */
(function(Tasks) {
// MODEL
Tasks.Model = Backbone.Model.extend({});

// COLLECTION
Tasks.Collection = Backbone.Collection.extend({
	model : Modules.Model,
	url : 'http://localhost/backendAdmin/index.php/controller/tasks'
});

// VIEW
Tasks.View = Backbone.View.extend({
	el : '#appTasks',
	initialize : function(options) {
		_.bindAll(this, "render");
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
	}
});
})(application.module("tasks"));