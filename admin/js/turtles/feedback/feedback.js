(function($){
    
    var view = Backbone.View.extend({
	initialize : function() {
	    // bind render event
	    this.bind("born", this.render);

	},
	render : function() {
	    var self = this;
	    $.get('turtles/feedback/feedback.html', function(template) {
                var data = "";
		self.$el.html($.tmpl(template, data));	
		// notify listeners render completed and pass element
		self.trigger("rendered", self.$el);
	    });
	}
    });
    
    // register turtle
    Turtles.register("feedback", {
	view : view
    });
    
})(jQuery);