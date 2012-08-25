/*
 * Dialog
 */
(function(Dialog) {
	//dependencies
	
	
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
					task: this.model
			};
			// add html to container
			this.$el.html($.tmpl(this.template, data));
			
			$('#datepicker').datepicker();
		}

	},
	events : {
		'click #send' : 'submit',
		'click .closebtn' : 'close'
	},
	submit : function() {
		/*//unsafe sending pass and name to backend except over https?
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
		});*/
	},
	close : function(){
		$('#myModal').remove();
	}
});
})(application.module("dialog"));