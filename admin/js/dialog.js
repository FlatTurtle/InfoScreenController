/*
 * Dialog window with more information about task
 * Author: Glenn Bostoen
 */

(function(Dialog) {
	// dependencies

	// VIEW
	Dialog.View = Backbone.View.extend({
		el : '#appDialog',
		initialize : function() {
			_.bindAll(this, "render");
			_.bindAll(this, "close");
			var self = this;
			console.log(this.model.toJSON());
			if (this.template == null) {
				$.get("dialog.html", function(template) {
					self.template = template;
					self.render();
				});
			}
		},
		render : function() {
			if (this.template) {
				var data = {
					task : this.model
				};
				// add html to container
				this.$el.html($.tmpl(this.template, data));
			}

		},
		events : {
			'click #send' : 'submit',
			'click .closebtn' : 'close'
		},
		close : function() {
			$('#myModal').remove();
		}
	});
})(application.module("dialog"));