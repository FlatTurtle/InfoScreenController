/*
 * loading and visualizing of screens
 * Author: Glenn Bostoen
 */
(function(Screens) {
	//dependencies
	var screensModule = application.module('screens');
	var userModule = application.module('user');
	var loginModule = application.module('login');
	var screeneditorModule = application.module('screeneditor');
	var routerModule = application.module('router');

	/*
	 * MODEL
	 */
	Screens.Model = Backbone.Model.extend({});

	/*
	 * COLLECTION
	 */
	Screens.Collection = Backbone.Collection.extend({
		model : Screens.Model,
		url : 'http://localhost/backendAdmin/index.php/controller/screens'
	});

	Screens.View = Backbone.View.extend({
		initialize : function() {
			_.bindAll(this, "render");
			_.bindAll(this, "screenClick");
			this.model.bind("change", this.render);
			this.model.bind("reset", this.render);
			this.model.bind("add", this.render);
			this.collection.bind("change", this.render);
			this.collection.bind("reset", this.render);
			this.collection.bind("add", this.render);

			var self = this;
			if (this.template == null) {
				$.get("screens.html", function(template) {
					self.template = template;
					self.render();
				});
			}
		},
		events:{
			'click .screen' : 'screenClick'
		},
		screenClick : function(e){
			console.log(e.target);
			var model = this.collection.getByCid($(e.target).attr('class'));
			new routerModule.Router().navigate("screeneditor/" + model.get('id'), {
				trigger : true
			});
		},
		render : function() {
			var self = this;
			if (this.template) {
				var data = {
						collection : this.collection,
						username : this.model.get('username')
				};

				// add html to container
				this.$el.html($.tmpl(this.template, data));
			}
		}
	});
})(application.module("screens"));