/*
 * functionality of modules(= turtles not related to the screen)
 * Author: Glenn Bostoen
 */
(function(Modules) {
	// MODEL
	Modules.Model = Backbone.Model.extend({});

	// COLLECTION
	Modules.Collection = Backbone.Collection.extend({
		model : Modules.Model,
		url : 'http://localhost/backendAdmin/index.php/controller/modules'
	});

	// VIEW
	Modules.View = Backbone.View.extend({
		el : '#appModules',
		initialize : function(options) {
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
					modules : this.collection.models
				};
				// add html to container
				this.$el.html($.tmpl(this.template, data));

				$.each($('.module'),function() {
					this.addEventListener('dragstart',self.handleDragStart, false);
					this.addEventListener('dragover',self.handleDragOver, false);
					this.addEventListener('dragend',self.handleDragEnd, false);
				});

				// notify listeners render completed and pass element
				this.trigger("rendered", this.$el);
			}
		},
		handleDragStart : function(e) {
			$(this).css('opacity', '0.4');

			dragSrcEl = this;

			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/html', this.innerHTML);

			$.each($('.addTurtle'), function() {
				$(this).css('display', 'inline');
			});

			$.each($('.newColumn'), function() {
				$(this).css('display', 'inline');
			});

		},

		handleDragOver : function(e) {
			if (e.preventDefault) {
				e.preventDefault(); // Necessary. Allows us to drop.
			}

			e.dataTransfer.dropEffect = 'move'; // See the section on the
			return false;
		},

		handleDragEnd : function() {
			$.each($('.addTurtle'), function() {
				$(this).css('display', 'none');
			});
			$(this).css('opacity', '1');

			$.each($('.newColumn'), function() {
				$(this).css('display', 'none');
			});
		}
	});
})(application.module("modules"));