(function($){
	
	var view = Backbone.View.extend({
		// hold google maps objects
		center : null,
		map : null,
		trafficLayer: null,

		initialize : function() {
			// bind render event
			this.bind("born", this.render);
			
			// render map when api is loaded
			this.bind("mapsReady", this.renderMap);
			
			// are we already loading the google maps api?
			if(typeof(window.mapsReady) == "undefined") {
				window.mapsReady = false;
				$.getScript("http://maps.googleapis.com/maps/api/js?sensor=false&callback=mapsLoaded");
			}
			
			// Define self 
			var self = this; 
			refreshInterval = window.setInterval(function () {
				self.updateTraffic();
			}, 2000);
		},
		render : function() {
			var self = this;
			$.get('turtles/map/map.html', function(template) {
				var data = {
					location : self.options.location,
					i18n : self.options.i18n
				};
				
				self.$el.html($.tmpl(template, data));
				
				// notify listeners render completed and pass element
				self.trigger("rendered", self.$el);
				
				// is the google api ready? else wait until the mapsReady trigger is activated
				if(window.mapsReady) {
					self.renderMap();
				}
			});
		},
		renderMap : function() {
			var self = this;
			
			// the canvas container
			var canvas = this.$el.find("#canvas")[0];
			
			// api options
			var options = {
			    zoom : this.options.zoom || 12,
			    disableDefaultUI: true,
			    mapTypeId : google.maps.MapTypeId.ROADMAP
			};
			
			this.map = new google.maps.Map(canvas, options);
			
			// fix when map was loading in wrong dimensions
			this.$el.bind("show", function() {
				google.maps.event.trigger(self.map, "resize");
				self.map.setCenter(self.center);
			});
			
			// bind resize trigger
			this.$el.resize(function() {
				google.maps.event.trigger(self.map, "resize");
				self.map.setCenter(self.center);
			});
			
			// get the coordinates of the location
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				"address" : this.options.location
				}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						self.center = results[0].geometry.location;
						self.map.setCenter(self.center);
						
						//console.log("turtles/map/workoffice.php?color=" + encodeURIComponent(infoScreen.color));
						
						var marker = new google.maps.Marker({
				            map: self.map,
				            position: results[0].geometry.location,
						    icon: new google.maps.MarkerImage("turtles/map/workoffice.php?color=" + encodeURIComponent(infoScreen.color))
				        });
					}
			});
			
			// add traffic layer
			self.trafficLayer = new google.maps.TrafficLayer();
			self.trafficLayer.setMap(self.map);
		},
		updateTraffic : function() {
			var self = this;
			
			// remove layer
			self.trafficLayer.setMap(null);
			self.trafficLayer = null;
			
			// add fresh layer
			self.trafficLayer = new google.maps.TrafficLayer();
			self.trafficLayer.setMap(self.map);
		}
	});
	
	// register turtle
	Turtles.register("map", {
		view : view
	});
	
})(jQuery);

// callback when the google maps api is ready
if (typeof mapsLoaded != 'function') {
	function mapsLoaded() {
		window.mapsReady = true;
		
		// trigger for all map turtles
		Turtles.trigger("map", "mapsReady");
	}
}