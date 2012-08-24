(function($) {

    var collection = Backbone.Collection.extend({
	initialize : function(models, options) {
	    // prevents loss of 'this' inside methods
	    _.bindAll(this, "refresh");

	    // bind refresh
	    this.bind("born", this.refresh);
	    this.bind("refresh", this.refresh);

	    // default error value
	    options.error = false;

	    // automatic collection refresh each minute, this will 
	    // trigger the reset event
	    refreshInterval = window.setInterval(this.refresh, 300000); //refresh every 5 minutes
	},
	refresh : function() {
	    var self = this;
	    self.fetch({
		error : function() {
		    // will allow the view to detect errors
		    self.options.error = true;
		    
		    // if there are no previous items to show, display error message
		    if(self.length == 0)
			self.trigger("reset");
		}
	    });
	},
	url : function() {

	    var query = "/TourTaxis/DeparturesShuttles";

	    // remote source url - todo: add departures or arrivals
	    return "http://data.flatturtle.com" + query + ".json";
	},
	parse : function(json) {
	    
	    // first filter the right times only
	    var today = new Date();
	    var minutes = today.getMinutes();
	    var hours = today.getHours();

	    if (minutes < 10)
		minutes = "0" + minutes;
	    
	    if (hours < 10)
		hours = "0" + hours;

	    // parse ajax results
	    var departures = json.DeparturesShuttles[0];
	    var liveboard = new Array();
	    var i = 0;
	    $.each(departures,function(key,val){
                var ttshuttlestime = new Date();
                ttshuttlestime.setHours(key.substr(0,2));
                ttshuttlestime.setMinutes(key.substr(3,2));
                var timenow = new Date();
		if(ttshuttlestime > timenow){
		    liveboard[i] = new Object();
		    liveboard[i].time = key;
		    liveboard[i].direction = val;
		    i++;
		}
	    });

	    return liveboard;
	}
    });

    var view = Backbone.View.extend({
	initialize : function() {
	    // prevents loss of 'this' inside methods
	    _.bindAll(this, "render");
	    // bind render to collection reset
	    
	    this.collection.bind("reset", this.render);

	    // pre-fetch template file and render when ready
	    var self = this;
	    if (this.template == null) {
		$.get("turtles/ttshuttles/list.html", function(template) {
		    self.template = template;
		    self.render();
		});
	    }
	},
	render : function() {
	    // only render when template file is loaded
	    if (this.template) {
		var data = {
		    direction : this.options.direction || "departures",
		    station : this.options.station,
		    entries : this.collection.toJSON(),
		    error : this.options.error, // have there been any errors?
		    i18n : this.options.i18n
		};

		// add html to container
		this.$el.html($.tmpl(this.template, data));
		
		// notify listeners render completed and pass element
		this.trigger("rendered", this.$el);
	    }
	}
    });

    // register turtle
    Turtles.register("ttshuttles", {
	collection : collection,
	view : view
    });

})(jQuery);
