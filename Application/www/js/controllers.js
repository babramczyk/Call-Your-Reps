angular.module('starter.controllers', ['firebase'])

/////////////////////////////////////
//     SPLASH SCREEN CONTROLLER    //
/////////////////////////////////////
.controller('SplashCtrl', function($state, $scope, $window, $rootScope, $timeout) {

	//$scope.submit = function() {
		
		// If user data is stored
		if($window.localStorage['userData']) {

			//console.log("Accessing Stored Load Data");

			//Load userData
			$rootScope.userData = JSON.parse($window.localStorage['userData']);
			//console.log($rootScope.userData);

			//Load repData
			$rootScope.repData = JSON.parse($window.localStorage['repData']);
			//console.log($rootScope.repData);

			//TODO: Update election data (sometimes update repData? Only if election data changes?)

			//Go to home
			$timeout(function(){$state.go('tab.home');}, 3000);
		}
		// Else, go to welcome to get user data
		else {
			//console.log("No Available Load Data");
			$timeout(function(){$state.go('welcome');}, 3000);
		}
		
	//}
})

/////////////////////////////////////
//    WELCOME SCREEN CONTROLLER    //
/////////////////////////////////////
.controller('WelcomeCtrl', function($state, $scope, $rootScope, Query, $window) {

	$scope.submit = function() {
		setUserName($scope.firstName, $scope.lastName);
		setUserAddress($scope.address, $scope.city, $scope.state, $scope.zip);

		var addr = $scope.address + ' ' + $scope.city + ' ' + $scope.state + ' ' + $scope.zip;
	
		//console.log(addr);
		
		var promise = Query.getRepData(addr);
		
		promise.then(function(data) {
			
			//console.log(data);

			if(data.office) {
				//Save to rootScope and localStorage
				$rootScope.userData = {'firstName': $scope.firstName,
					'lastName': $scope.lastName,
					'address': data.userAddrs};
				//console.log($rootScope.userData);

				$window.localStorage['userData'] = JSON.stringify($rootScope.userData);

				$rootScope.repData = {'office': data.office,
					'twitterHandles': data.twitterHandles};
				//console.log($rootScope.repData);

				$window.localStorage['repData'] = JSON.stringify($rootScope.repData);

				//Go to home
				$state.go('tab.home');
			}
			else{
				//TODO: Display Error message, tell user to re-enter address

				//Log error
				console.log("Invalid Address");
			}
		});
	}
})


.controller('HomeCtrl', function($scope, $state, $ionicViewSwitcher) {
	
	$scope.contact = function(rep) {
		$state.go('tab.rep-contact', {rep: rep});
	}

	$scope.info = function(rep) {
		$state.go('tab.rep-info', {rep: rep});
	}

	// $ionicViewSwitcher.nextDirection('forward');
})


.controller('RepContactCtrl', function($scope, $rootScope, $stateParams) {
  // stateParam will be a rep data object with appropriate fields
  var rep = $stateParams.rep;
  
  // Fill in defaults
  $scope.phone = "Call";
  $scope.email = "Email";
  
  // Fill rep info
  $scope.repName = rep.name;
  if(rep.photoUrl) {
  	$scope.imgSrc = rep.photoUrl;
  }
  else {
  	// TODO: Use generic silhouette
  	$scope.imgSrc = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Man_silhouette.svg/703px-Man_silhouette.svg.png'
  }
  if(rep.phones) {
    $scope.phoneNumber = rep.phones[0];
  }
  else {
  	// TODO: Make button unavailable
  	$scope.phone = "NO PHONE LISTED";
  }
  if(rep.emails) {
  	$scope.emailAddress = rep.emails[0];
  }
  else {
  	// TODO: Make button unavailable
  	$scope.email = "NO EMAIL LISTED";
  }
  

  $scope.script = "Hello, my name is " + $rootScope.userData.firstName + " and I am in representative " + $scope.repName + "'s district. I was hoping to them today about their recent activity and policies."; // TODO: Change script eventually
})


.controller('RepInfoCtrl', function($scope, $rootScope, $stateParams) {
  // stateParam will be a rep data object with appropriate fields
  var rep = $stateParams.rep;

  //console.log(rep);

  // Fill rep info
  $scope.repName = rep.name;
  if(rep.photoUrl) {
  	$scope.imgSrc = rep.photoUrl;
  }
  else {
  	// TODO: Use generic silhouette
  	$scope.imgSrc = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Man_silhouette.svg/703px-Man_silhouette.svg.png'
  }
  $scope.office = rep.officeName;
  if(rep.phones) {
    $scope.phoneNumber = rep.phones[0];
  }
  else {
  	$scope.phoneNumber = "No Phone Listed";
  }
  if(rep.emails) {
  	$scope.emailAddress = rep.emails[0];
  }
  else {
  	$scope.emailAddress = "No Email Listed";
  }
  $scope.address = "";
  if(rep.address) {  
  	var add = rep.address[0];	
  	for(var line in add) {
  	   $scope.address += (add[line] + '\n');
  	}
  	
  }
  else {
  	$scope.address = "No Address Listed";
  }
  if(rep.urls[0]) {
  	//TODO: Add support for back button?
  	$scope.web = "Visit Reps Website";
  	$scope.website = rep.urls[0];
  }
  else {
  	//TODO: Make button unavailable
  	$scope.web = "No Website Listed";
  }
  $scope.bio = "TODO: Find a bio source?";
})


.controller('ElectionsCtrl', function($scope, $rootScope, $ionicModal, $window) {
	var address = JSON.parse($window.localStorage['userData']).address;
	$scope.userAddress = address.line1 + ', ' + address.city + ' ' + address.state + ', ' + address.zip;

  // TODO: Brian; get polling place, upcoming elections with address
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

	$ionicModal.fromTemplateUrl('templates/settings-modal.html', {
 		scope: $scope,
 		animation: 'slide-in-up'
	}).then(function(modal) {
 		$scope.settingsModal = modal;
	});

	$scope.openSettings = function() {
    $scope.firstName = $rootScope.userData.firstName;
    $scope.lastName = $rootScope.userData.lastName;
    $scope.address = $rootScope.userData.address.line1;
    $scope.city = $rootScope.userData.address.city;
    $scope.state = $rootScope.userData.address.state;
    $scope.zip = $rootScope.userData.address.zip;
    $scope.settingsModal.show();
    console.log($rootScope.userData.firstName);
    console.log($scope.firstName);
  }

	$scope.saveSettings = function() {
	  var address = {
	    line1: $scope.address,
      state: $scope.state,
      city: $scope.city,
      zip: $scope.zip
    }
    $rootScope.userData = {'firstName': $scope.firstName,
      'lastName': $scope.lastName,
      'address': address};
    $window.localStorage['userData'] = JSON.stringify($rootScope.userData);

 		$scope.settingsModal.hide();
	};
// $scope.$on('$destroy', function() {
//$scope.modal.remove();
// });
})


.controller('ActivityCtrl', function($scope, $rootScope) {

	console.log("Activity Screen Controller initialized");
})

.controller('FeedsCtrl', function($scope, $rootScope) {

	console.log("Feeds Screen Controller initialized");

	//$rootScope.repData.twitterHandles is a string array of twitter handles
})