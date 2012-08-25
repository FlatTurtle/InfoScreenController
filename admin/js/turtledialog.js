/*
 * Dialog
 */
(function(Turtledialog) {
	// dependencies
	Turtledialog.Model = Backbone.Model.extend({
	});
	
	Turtledialog.Collection = Backbone.Collection.extend({
		model: Turtledialog.Model,
		url : 'http://localhost/backendAdmin/index.php/controller/options'
	});

	Turtledialog.View = Backbone.View.extend({
		el : '#appDialog',
		initialize : function() {
			_.bindAll(this, "render");
			_.bindAll(this, "close");
			
			
			this.collection.bind("reset", this.render);
			this.collection.bind('add', this.render);
			this.collection.bind('change', this.render);
			
			var self = this;
			
			
			if (this.template == null) {
				$.get("turtledialog.html", function(template) {
					self.template = template;
					self.render();
				});
			}
		},
		render : function() {
			if (this.template) {
				console.log(this.collection.toJSON());
				var data = {
					collection: this.collection
				};
				// add html to container
				this.$el.html($.tmpl(this.template, data));

				//$('#datepicker').datepicker();
			}

		},
		events : {
			'click #send' : 'submit',
			'click .closebtn' : 'close'
		},
		submit : function() {
			/*
			 * //unsafe sending pass and name to backend except over https? var
			 * name = $('#login').val(); var pass = $('#password').val();
			 * //console.log(name+pass);
			 * 
			 * $.ajax({ url :
			 * 'http://localhost/backendAdmin/index.php/controller/login', type :
			 * "POST", data : { name : name, pass : pass }, success :
			 * function(data, textStatus, xhr) { //console.log('success');
			 * //console.log(xhr.status + ' ' + textStatus); username = data;
			 * new Login.Router().navigate("screens", { trigger : true, replace :
			 * true }); }, error : function(xhr, ajaxOptions, thrownError) {
			 * //console.log('fail'); //console.log(xhr.status); } });
			 */
		},
		close : function() {
			$('#myModal').remove();
		}
	});
})(application.module("turtledialog"));