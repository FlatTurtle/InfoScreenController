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
		initialize : function() {
			_.bindAll(this, "render");
			_.bindAll(this, "close");
			_.bindAll(this, "save");
			
			
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
			'click .closebtn' : 'close',
			'click .savebtn' : 'save'
		},
		close : function() {
			this.remove();
			this.unbind();
			this.model.unbind("change", this.modelChanged);
		},
		save : function(){
			var self = this;
			var added = new Array();
			var turtle_configs = new Array();
			$.each($('select'),function(){
				var value = $(this).val();
				if($.inArray(value, added) == -1){
					added.push(value);
					var turtle_config = {
							turtle_id : self.model.get('id'),
							option_id : self.collection.getByCid(value).get('id'),
							extra_value: 'NULL'
					}
					turtle_configs.push(turtle_config);
				}
			});
			$.each($('input.turtleOption'),function(){
				var cid = $(this).attr('id');
				var value = $(this).val();
				var turtle_config = {
						turtle_id : self.model.get('id'),
						option_id : self.collection.getByCid(cid).get('id'),
						extra_value : value
				}
				turtle_configs.push(turtle_config);
			})
			console.log(turtle_configs);
			
			$.ajax({
				url : 'http://localhost/backendAdmin/index.php/controller/turtle_configs',
				type : 'POST',
				data : {
					turtle_configs: turtle_configs
				},
				success : function(data, textStatus, xhr) {
					console.log(turtle);
					console.log('success');
					//console.log(xhr.status + ' ' + textStatus);
				},
				error : function(xhr, ajaxOptions, thrownError) {
					console.log('fail');
					console.log(xhr.status);
				}
			});
		}
	});
})(application.module("turtledialog"));