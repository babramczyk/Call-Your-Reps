angular.module('starter.controllers', [])

.controller('WelcomeCtrl', function($scope) {

})

.controller('CallCtrl', function($scope) {

})

.controller('HomeCtrl', function($scope, $ionicModal) {
  // Actual implementations when these functions are set up
  // $scope.nextElectionDate = getNextElectionDate().toLocaleDateString('en-US',
//   { month: 'long',
//     day: 'numeric',
//     year: 'numeric' });
  // $scope.pollingPlace = getPollingPlace();

  // Placeholders for now
  $scope.nextElectionDate = new Date(2017, 4, 3).toLocaleDateString('en-US',
    { month: 'long',
      day: 'numeric',
      year: 'numeric' });
  $scope.pollingPlace = "342 Langdon Street (Red Gym)";


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
  //   $scope.modal.remove();
  // });
})

.controller('InfoCtrl', function($scope) {

})