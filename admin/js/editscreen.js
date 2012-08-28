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
				
				$('#cp1').colorpicker().on('changeColor', function(ev){
					  //console.log('colorChange');
					  $('#cp1').attr('value',ev.color.toHex());
					  $('#colorHeader').css('background-color',ev.color.toHex());
				}).on('hide',function(ev){
					console.log('colorSave');
					self.model.set({color: ev.color.toHex()});
					console.log(self.model.toJSON());
					$.ajax({
						url : 'http://localhost/backendAdmin/index.php/controller/screens',
						type : 'POST',
						data : {
							screens: Array(self.model.toJSON())
						},
						success : function(data, textStatus, xhr) {
							console.log('success');
							//fetching turtles
						},
						error : function(xhr, ajaxOptions, thrownError) {
							console.log('fail');
							console.log(xhr.status+" "+thrownError);
						}
					});
				});
			}
		}
	});
})(application.module('editscreen'));