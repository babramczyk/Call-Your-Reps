angular.module('starter.controllers', ['firebase'])

/////////////////////////////////////
// WELCOME SCREEN CONTROLLER //
/////////////////////////////////////
.controller('WelcomeCtrl', function($state, $scope, $firebase) {

  $scope.state = "none";

	$scope.submit = function() {
		// TODO: Database person, save user's address from scope into SQLite database

    console.log($scope.state);
		$state.go('tab.home');
	}


  // console.log("Welcome Screen Controller initialized");
  //
  // // Fuction for email signup!!! NOT WORKING !!!
  // $scope.signupEmail = function(){
  //
  // 	var ref = new Firebase("https://call-your-reps-b230a.firebaseio.com");
  //
  // 	ref.auth().createUserWithEmailAndPassword($scope.newEmail, $scope.newPassword).catch(function(error) {
  // 		var errorCode = error.code;
  // 		var errorMessage = error.message;
  // 		console.log("Error creating user:", errorMessage);
  // 	});
  // };
  //
  // // Function for email signin !!! NOT WORKING !!!
  // $scope.loginEmail = function(){
  //
  // 	var ref = new Firebase("https://call-your-reps-b230a.firebaseio.com");
  //
  // 	ref.authWithPassword({
  // 	email: $scope.userEmail,
  // 	password : $scope.userPassword
  // 	}, function(error, authData) {
  // 	if (error) {
  // 		console.log("Login Failed!", error);
  // 	} else {
  // 	console.log("Authenticated successfully with payload:", authData);
  // 	}
  // 	});
  //
  // };
})

	
.controller('HomeCtrl', function($scope, $state, $ionicViewSwitcher) {
	// Actual implementations when these functions are set up
	// $scope.senateReps = getSenateReps();
	// $scope.houseReps = getHouseReps();

	// Placeholders
	$scope.senateReps = [
		{ name: "Tammy Baldwin",
			district: "2nd District"
		}, {
      name: "Ron Johnson",
      district: "1st District"
		}
	];
	$scope.houseReps = [
    { name: "Mark Pocan",
      district: "2nd Congressional District"
    }, {
      name: "F. James Sensenbrenner Jr.",
      district: "5th Congressional District"
    }
	];

	$scope.goToContactPage = function(name) {
	  $ionicViewSwitcher.nextDirection('forward');
	  $state.go('rep-contact', { name: name });
    // $state.go('tab.elections');
	  console.log("clicked");
  };

	console.log("Rep Contact Controller initialized");
})


.controller('RepContactCtrl', function($scope, $stateParams) {
  // $scope.name = $stateParams.name;
  // $scope.userName = getUserFullName(); // TODO: Database person, implement function that queries for user's name
  // $scope.imgSrc = getRepImgSrc($scope.name);
  // $scope.phoneNumber = getRepPhone($scope.name);
  // $scope.email = getRepEmail($scope.email);

  // Placeholders
  $scope.name = "Tammy Baldwin";
  $scope.userName = "Brett Abramczyk";
  $scope.imgSrc = "https://s3.amazonaws.com/givegreen-cdn/2011/09/680484_10151472016201102_1735214013_o-300x300.jpg";
  $scope.phoneNumber = "+1-414-902-0285";
  $scope.email = "bjabramczyk@gmail.com";

  $scope.script = "Hello, my name is " + $scope.userName + " and I am in representative " + $scope.name + "'s district. I was hoping to them today about their recent activity and policies."; // TODO: Change script eventually
})
	
	
.controller('RepInfoCtrl', function($scope) {

	console.log("Rep Info Controller initialized");
})


.controller('ElectionsCtrl', function($scope, $ionicModal) {
	// Actual implementations when these functions are set up
// 	$scope.userAddress = getUserAddress();
//   $scope.pollingPlace = getPollingPlace();
//   $scope.upcomingElections = getUpcomingElections();
// 	$scope.nextElectionDate = getNextElectionDate().toLocaleDateString('en-US', {
// 		month: 'long',
// 		day: 'numeric',
// 		year: 'numeric' });

// Placeholders for now
	$scope.userAddress = "1234 Main St, Madison WI, 53711";
  $scope.pollingPlace = "342 Langdon Street (Red Gym)";
  $scope.upcomingElections = [
		{ name: "2017 Spring Election",
			date: "April 4, 2017",
			ballot: 0 // Unique ID to pass as stateParam to find correct ballot
		}, {
      name: "2018 Spring Primary",
      date: "February 4, 2017",
      ballot: 1
		}
	];
	$scope.nextElectionDate = new Date(2017, 4, 3).toLocaleDateString('en-US',
 		{ month: 'long',
			day: 'numeric',
		 	year: 'numeric' });


// Settings Modal

	$ionicModal.fromTemplateUrl('settings-modal.html', {
 		scope: $scope,
 		animation: 'slide-in-up'
	}).then(function(modal) {
 		$scope.settingsModal = modal;
	});

	$scope.openSettings = function() {
	 $scope.settingsModal.show();
	};
	$scope.closeSettings = function() {
	 $scope.settingsModal.hide();
	};
	$scope.saveSettings = function() {
 		// TODO: Save text fields to user settings (in db or local storage...)
 		$scope.settingsModal.hide();
	};
// $scope.$on('$destroy', function() {
//$scope.modal.remove();
// });

	console.log("Elections Screen Controller initialized");
})


.controller('ActivityCtrl', function($scope) {

	console.log("Activity Screen Controller initialized");
})

.controller('FeedsCtrl', function($scope) {

	console.log("Feeds Screen Controller initialized");
})