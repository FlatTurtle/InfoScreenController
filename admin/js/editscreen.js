/*
 * functionality for changing general stuff related to the screen
 * Author: Glenn Bostoen
 */
(function(Editscreen) {
	Editscreen.Model = Backbone.Model.extend({
		url : 'http://localhost/backendAdmin/index.php/controller/screen/'
	});
	Editscreen.View = Backbone.View.extend({
		initialize : function() {
			_.bindAll(this, "render");
			this.model.bind("reset", this.render);
			this.model.bind('add', this.render);
			this.model.bind('change', this.render);

			var self = this;
			if (this.template == null) {
				$.get("header.html", function(template) {
					self.template = template;
					self.render();
				});
			}
		},
		render : function() {
			var self = this;
			if (this.template) {
				var data = {
					model : self.model
				};

				// add html to container
				this.$el.html($.tmpl(this.template, data));
			}
		}
	});
})(application.module('editscreen'));