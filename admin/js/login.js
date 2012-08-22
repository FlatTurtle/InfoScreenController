/*
 * LOGIN
 */
(function(Login) {
	//dependencies
	
	
Login.View = Backbone.View.extend({
	el : 'body',
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
		//unsafe sending pass and name to backend except over https?
		var name = $('#login').val();
		var pass = $('#password').val();
		//console.log(name+pass);

		$.ajax({
			url : 'http://localhost/backendAdmin/index.php/controller/login',
			type : "POST",
			data : {
				name : name,
				pass : pass
			},
			success : function(data, textStatus, xhr) {
				//console.log('success');
				//console.log(xhr.status + ' ' + textStatus);
				username = data;
				new Login.Router().navigate("screens", {
					trigger : true,
					replace : true
				});
			},
			error : function(xhr, ajaxOptions, thrownError) {
				//console.log('fail');
				//console.log(xhr.status);
			}
		});
	}
});

Login.Router = Backbone.Router.extend({
	routes : {
		'screens' : 'screensRoute'
	},
	screensRoute : function() {
		// alert(screenid);
		var screensModule = application.module('screens');
		screens = new screensModule.Collection();
		screens.fetch({
			error : function() {
				new Login.Router().navigate("", {
					trigger : true,
					replace : true
				});
			}
		});
		var userModule = application.module('user');
		user = new userModule.Model();
		user.fetch({
			error : function() {
				new Login.Router().navigate("", {
					trigger : true,
					replace : true
				});
			}
		});
		var screensModule = application.module('screens');
		var screensView = new screensModule.View({
			collection : screens,
			model : user
		});
	}
});
})(application.module("login"));