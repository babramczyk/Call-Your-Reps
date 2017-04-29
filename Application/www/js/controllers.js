angular.module('starter.controllers', ['firebase'])

/////////////////////////////////////
//     SPLASH SCREEN CONTROLLER    //
/////////////////////////////////////
.controller('SplashCtrl', function($state, $scope, $window, $rootScope, $timeout) {

	//$scope.submit = function() {

		// If user data is stored
		if($window.localStorage.userData) {

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
.controller('WelcomeCtrl', function($state, $scope, $rootScope, $stateParams, Query, $window) {
  if (!$stateParams.error) {
    $scope.header = "Welcome";
    $scope.message = "Enter some information about yourself so we can help find your representatives.";
  } else {
    $scope.header = "Uh-oh!";
    $scope.message = "Something went wrong with your information. Please enter your full name and a valid US address to continue."
  }

	$scope.submit = function() {
		setUserName($scope.firstName, $scope.lastName);
		setUserAddress($scope.address, $scope.city, $scope.state, $scope.zip);

		var addr = $scope.address + ' ' + $scope.city + ' ' + $scope.state + ' ' + $scope.zip;

		var promise = Query.getRepData(addr);

		promise.then(function(data) {

			//console.log(data);

			if (data.office) {
				var userData = {
				  firstName: $scope.firstName,
					lastName: $scope.lastName,
					address: data.userAddrs
				};

				$window.localStorage.userData = JSON.stringify(userData);

				var repData = {
				  office: data.office,
					twitterHandles: data.twitterHandles
				};

				$window.localStorage.repData = JSON.stringify(repData);

				$state.go('tab.home');
			}
			else {
				//Log error
				console.log("Invalid Address");
			}
		});
	}
})


.controller('HomeCtrl', function($scope, $rootScope, $state, $ionicViewSwitcher, $window, $ionicNavBarDelegate) {
  if (!validateLocalStorage($window)) {
    $state.go('welcome', { error: true });
  }

  $scope.repData = JSON.parse($window.localStorage.repData);

	$scope.contact = function(rep) {
    $ionicNavBarDelegate.showBackButton(true);
    $ionicViewSwitcher.nextDirection('forward');
		$state.go('tab.rep-contact', {rep: rep});
	}

	$scope.info = function(rep) {
    $ionicNavBarDelegate.showBackButton(true);
    $ionicViewSwitcher.nextDirection('forward');
		$state.go('tab.rep-info', {rep: rep});
	}
})


.controller('RepContactCtrl', function($state, $scope, $rootScope, $stateParams, $window, $ionicViewSwitcher, $ionicNavBarDelegate) {
  if (!validateLocalStorage($window)) {
    $state.go('welcome', { error: true });
  }

  // stateParam will be a rep data object with appropriate fields
  var rep = $stateParams.rep;

  // Check if we got to this page without a representative. If so, send back to home
  if (rep.name == undefined) {
    $ionicNavBarDelegate.showBackButton(false);
    $ionicViewSwitcher.nextDirection('back');
    $state.go('tab.home');
  }


  // Fill in defaults
  $scope.phone = "Call";
  $scope.email = "Email";
  $scope.userName = JSON.parse($window.localStorage.userData).firstName + ' ' + JSON.parse($window.localStorage.userData).lastName;

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


  $scope.script = "Hello, my name is " + $scope.userName + " and I am in representative " + $scope.repName + "'s district. I was hoping to them today about their recent activity and policies."; // TODO: Change script eventually
})


.controller('RepInfoCtrl', function($state, $scope, $rootScope, $stateParams, $window, $ionicNavBarDelegate, $ionicViewSwitcher) {
  if (!validateLocalStorage($window)) {
    $state.go('welcome', { error: true });
  }

  // stateParam will be a rep data object with appropriate fields
  var rep = $stateParams.rep;

  if (rep.name == undefined) {
    $ionicNavBarDelegate.showBackButton(false);
    $ionicViewSwitcher.nextDirection('back');
    $state.go('tab.home');
  }

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


.controller('ElectionsCtrl', function($state, $scope, $rootScope, $ionicModal, $window, $ionicLoading, $compile, Query) {
  if (!validateLocalStorage($window)) {
    $state.go('welcome', { error: true });
  }

	var address = JSON.parse($window.localStorage['userData']).address;
	$scope.userAddress = address.line1 + ', ' + address.city + ' ' + address.state + ', ' + address.zip;

  // TODO: Brian; get polling place, upcoming elections with address
  $scope.pollingPlace = "306 N Brooks St, Madison, WI 53715";
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

  function initialize() {
    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);

    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"),
      mapOptions);
    var geocoder = new google.maps.Geocoder();

    geocodeAddress(geocoder, map);

    $scope.map = map;
  }
  //geocode, to get coordinates from address and mark on map
  function geocodeAddress(geocoder, resultsMap) {
    var address = $scope.pollingPlace;//document.getElementbyId('address').value;
    geocoder.geocode({'address': $scope.pollingPlace}, function(results, status) {
      if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });
        var contentString = "<div><a ng-click='clickTest()'>{{pollingPlace}}</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });
      }
    })
  }
  ionic.Platform.ready(initialize);

// Settings Modal

	$ionicModal.fromTemplateUrl('templates/settings-modal.html', {
 		scope: $scope,
 		animation: 'slide-in-up'
	}).then(function(modal) {
 		$scope.settingsModal = modal;
 		$scope.errorMsg = "";
 		$scope.header = "People move. We get it.";
	});

	$scope.openSettings = function() {
	  var userData = JSON.parse($window.localStorage.userData);
	  console.log(userData);

    $scope.firstName = userData.firstName;
    $scope.lastName = userData.lastName;
    $scope.address = userData.address.line1;
    $scope.city = userData.address.city;
    $scope.state = userData.address.state;
    $scope.zip = userData.address.zip;
    $scope.settingsModal.show();
  }

	$scope.saveSettings = function() {

    // Hacky way of getting input values
    var address = {
      line1: document.getElementById('address').value,
      state: document.getElementById('state').value,
      city: document.getElementById('city').value,
      zip: document.getElementById('zip').value
    }
    var userData = {
      firstName: document.getElementById('first-name').value,
      lastName: document.getElementById('last-name').value,
      address: address
    }

    // Get new rep info
    var addr = address.line1 + ' ' + address.state + ' ' + address.city + ' ' + address.zip;
    var promise = Query.getRepData(addr);

    promise.then(function(data) {

      if (data.office) {

        $window.localStorage.userData = JSON.stringify(userData);

        var repData = {
          office: data.office,
          twitterHandles: data.twitterHandles
        };

        $window.localStorage.repData = JSON.stringify(repData);

        $scope.errorMsg = "";
        $scope.header = "People move. We get it.";
        $scope.settingsModal.hide();
      } else {
        $scope.header = "Uh-oh!";
        $scope.errorMsg = "Something went wrong with your information. Please enter your full name and a valid US address to continue."
        //Log error
        console.log("Invalid Address");
      }
    });

	};
  // $scope.$on('$destroy', function() {
  //   $scope.modal.remove();
  // });
})


.controller('ActivityCtrl', function($state, $scope, $rootScope, $window) {
  if (!validateLocalStorage($window)) {
    $state.go('welcome', { error: true });
  }

	console.log("Activity Screen Controller initialized");
})

.controller('FeedsCtrl', function($state, $scope, $rootScope, $window) {
  if (!validateLocalStorage($window)) {
    $state.go('welcome', { error: true });
  }

	console.log("Feeds Screen Controller initialized");

  TwitterREST.sync().then(function(tweets){
    console.log(tweets);
    $scope.tweets = tweets.statuses;
  });

  $scope.innapBrowser = function (value) {
    window.open(value, '_blank');
  };

	//$rootScope.repData.twitterHandles is a string array of twitter handles
})
