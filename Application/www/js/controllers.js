angular.module('starter.controllers', ['firebase'])

/////////////////////////////////////
//    WELCOME SCREEN CONTROLLER    //
/////////////////////////////////////
.controller('WelcomeCtrl', function($scope, $firebase) {

	console.log("Welcome Screen Controller initialized");

	// Fuction for email signup  !!! NOT WORKING !!!
	$scope.signupEmail = function(){  
 
		var ref = new Firebase("https://call-your-reps-b230a.firebaseio.com");
 
		ref.auth().createUserWithEmailAndPassword($scope.newEmail, $scope.newPassword).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log("Error creating user:", errorMessage);
		});	 
	};

	// Function for email signin  !!! NOT WORKING !!!
	$scope.loginEmail = function(){
 
		var ref = new Firebase("https://call-your-reps-b230a.firebaseio.com");
	 
		ref.authWithPassword({
	    	email    : $scope.userEmail,
	    	password : $scope.userPassword
		}, function(error, authData) {
	    	if (error) {
	    		console.log("Login Failed!", error);
	    	} else {
	    	console.log("Authenticated successfully with payload:", authData);
	    	}
		});
 
	};

})

//////////////////////////////////
//    CALL SCREEN CONTROLLER    //
//////////////////////////////////
.controller('CallCtrl', function($scope) {

	console.log("Call Screen Controller initialized");

})

//////////////////////////////////
//    HOME SCREEN CONTROLLER    //
//////////////////////////////////
.controller('HomeCtrl', function($scope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  	console.log("Home Screen Controller initialized");

})

//////////////////////////////////
//    INFO SCREEN CONTROLLER    //
//////////////////////////////////
.controller('InfoCtrl', function($scope) {

	console.log("Info Screen Controller initialized");

})