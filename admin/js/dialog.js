/*
 * Dialog window with more information about task
 * Author: Glenn Bostoen
 */

(function(Dialog) {

	// VIEW
	Dialog.View = Backbone.View.extend({
		initialize : function(options) {
			_.bindAll(this, "render");
			_.bindAll(this, "close");
			if(this.collection){
				this.collection.bind("reset", this.render);
				this.collection.bind('add', this.render);
				this.collection.bind('change', this.render);
			}
			this.model.bind("reset", this.render);
			this.model.bind('add', this.render);
			this.model.bind('change', this.render);
			this.screenid = options.screenid;
			this.scheduled_tasks = options.scheduled_tasks;
			
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
					task : this.model,
					collection: this.collection
				};
				// add html to container
				this.$el.html($.tmpl(this.template, data));
				// select days
				var array = Array(64, 32, 16, 8, 4, 2, 1);
				var size = this.model.get('day_of_week');
				for ( var x = 0; x < array.length; x++) {
					if (size >= array[x]) {
						$('.checkbox.day').eq(x).attr('checked', 'checked');
						size = size - array[x];
					}
				}
				$('#hours option').eq(this.model.get('hours')).attr('selected',
						'selected');
				$('#minutes option').eq(this.model.get('minutes')).attr(
						'selected', 'selected');
			}

		},
		events : {
			'click .savebtn' : 'save',
			'click .closebtn' : 'close'
		},

		save : function() {
			var self = this;
			var days = 0;
			$.each($('.checkbox.day'),function(){
				if($(this).attr('checked') == 'checked') days+= parseInt($(this).val());
			});
			var hours = $('#hours').val();
			var minutes = $('#minutes').val();
			//insert model
			if(this.model.get('dialog') == 'insertTask'){
				var job_alias = this.collection.getByCid($('#newTask').val()).get('alias');
				this.model.set({hours:hours,minutes:minutes,day_of_week:days,month:'*',activated:'1',job_alias:job_alias,screen_id:this.screenid});
				
				this.model.set({hours: hours,minutes:minutes,day_of_week:days});
				$.ajax({
					url : 'http://localhost/backendAdmin/index.php/controller/tasks_insert',
					type : 'POST',
					data : {
						tasks: Array(this.model.toJSON())
					},
					success : function(data, textStatus, xhr) {
						console.log(xhr.status + ' ' + textStatus);
						console.log('inserting succcess')
						self.scheduled_tasks.fetch({success: function(){
							for(x in self.scheduled_tasks.models){
								if(self.scheduled_tasks.models[x].get('day_of_week') == '*') self.scheduled_tasks.models[x].set({day_of_week:127});
							}
						}});
					},
					error : function(xhr, ajaxOptions, thrownError) {
						console.log('fail');
						console.log(xhr.status);
					}
				});
				this.close();
			}
			//update model
			else{
				this.model.set({hours: hours,minutes:minutes,day_of_week:days});
				$.ajax({
					url : 'http://localhost/backendAdmin/index.php/controller/tasks',
					type : 'POST',
					data : {
						tasks: Array(this.model.toJSON())
					},
					success : function(data, textStatus, xhr) {
						console.log(xhr.status + ' ' + textStatus);
					},
					error : function(xhr, ajaxOptions, thrownError) {
						//console.log('fail');
						console.log(xhr.status);
					}
				});
				this.close();
			}
			
		},

		close : function() {
			this.remove();
			this.unbind();
			this.model.unbind("change", this.modelChanged);
		}
	});
})(application.module("dialog"));