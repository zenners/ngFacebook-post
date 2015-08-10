'use strict';

angular.module('ngSocial.facebook', ['ngRoute', 'ngFacebook'])

.config( function( $facebookProvider ) {
  $facebookProvider.setAppId('1189975784361379');
  $facebookProvider.setPermissions('email, public_profile, user_posts, publish_actions, user_photos');
})

.run(function($rootScope){
 (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
})

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facebook', {
    templateUrl: 'facebook/facebook.html',
    controller: 'FacebookCtrl'
  });
}])

.controller('FacebookCtrl', ['$scope', '$facebook', function($scope, $facebook) {
	$scope.isLoggedIn = false;

	$scope.login = function(){
		$facebook.login().then(function(){
			$scope.isLoggedIn = true;
			refresh();
		})
	}
	$scope.logout = function(){
		$facebook.logout().then(function(){
			$scope.isLoggedIn = false;
			refresh();
		})
	}
	$scope.postStatus = function(){
		var body = this.body;
		$facebook.api('/me/feed', 'post', {message: body}).then(function(res){
			$scope.msg = 'Thanks for posting here and on Facebook';
			$scope.body = '';
			refresh()
		})
	}
	function refresh(){
		$facebook.api('/me', {fields: 'last_name, first_name, email, gender, locale, link'}).then(function(res){
			$scope.welcomeMsg = 'Welcome ' + res.first_name;
			$scope.isLoggedIn = true;
			$scope.userInfo = res;
			$facebook.api('/me/picture').then(function(res){
				$scope.picture = res.data.url;
				$facebook.api('/me/permissions').then(function(res){
					$scope.permissions = res.data
					$facebook.api('/me/posts').then(function(res){
						$scope.posts = res.data
					})
				})
			})
		}, function(err){
			$scope.welcomeMsg = 'Please Log in'
		})
	}
	refresh();
}]);