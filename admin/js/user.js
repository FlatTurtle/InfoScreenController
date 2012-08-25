/*
 * user model
 * Author: Glenn Bostoen
 */
(function(User) {
	User.Model = Backbone.Model.extend({
		url : 'http://localhost/backendAdmin/index.php/controller/user'
	});
})(application.module("user"));