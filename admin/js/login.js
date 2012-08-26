/*
 * Login functionality
 * Author: Glenn Bostoen
 */
(function(Login) {
	// dependencies
	var screensModule = application.module('screens');
	var userModule = application.module('user');
	var screensModule = application.module('screens');
	var routerModule = application.module('router');

	// VIEW
	Login.View = Backbone.View
			.extend({
				initialize : function() {
					_.bindAll(this, "render");
					var self = this;
					if (this.template == null) {
						$.get("login.html", function(template) {
							self.template = template;
							self.render();
						});
					}
				},
				render : function() {
					if (this.template) {
						var data = {};

						// add html to container
						this.$el.html($.tmpl(this.template, data));
					}

				},
				events : {
					'click #send' : 'submit'
				},
				submit : function() {
					// unsafe sending pass and name to backend except over
					// https?
					var name = $('#login').val();
					var pass = $('#password').val();

					$.ajax({
						url : 'http://localhost/backendAdmin/index.php/controller/login',
						type : "POST",
						data : {
							name : name,
							pass : pass
						},
						success : function(data, textStatus, xhr) {
							console.log(xhr.status + ' ' + textStatus);
							username = data;
							new routerModule.Router().navigate("screens", {trigger : true});
						},
						error : function(xhr, ajaxOptions, thrownError) {
							console.log(xhr.status);
						}
					});
				}
			});
})(application.module("login"));