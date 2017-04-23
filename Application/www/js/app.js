// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
    }

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'templates/tab-home.html',
          controller: 'HomeCtrl'
        },
        // 'rep-contact': {
        //   templateUrl: 'templates/rep-contact.html',
        //   controller: 'RepContactCtrl'
        // }, 'rep-info': {
        //   templateUrl: 'templates/rep-info.html',
        //   controller: 'RepInfoCtrl'
        // }
      }
    })

  .state('tab.elections', {
    url: '/elections',
    views: {
      'tab-elections': {
        templateUrl: 'templates/tab-elections.html',
        controller: 'ElectionsCtrl'
      }
    }
  })

  .state('tab.activity', {
    url: '/activity',
    views: {
      'tab-activity': {
        templateUrl: 'templates/tab-activity.html',
        controller: 'ActivityCtrl'
      }
    }
  })

  .state('tab.feeds', {
    url: '/feeds',
    views: {
      'tab-feeds': {
        templateUrl: 'templates/tab-feeds.html',
        controller: 'FeedsCtrl'
      }
    }
  })

  .state('welcome', {
    url: '/welcome',
    templateUrl: 'templates/welcome.html',
    controller: 'WelcomeCtrl'
  })


  .state('rep-contact', {
    url: '/contact',
    // parent: 'tab.home',
    templateUrl: 'templates/rep-contact.html',
    controller: 'RepContactCtrl',
    params: {
      name: null
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/contact');

});
