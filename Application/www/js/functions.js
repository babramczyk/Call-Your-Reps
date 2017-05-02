//---------- Config ----------//
/**
 * Clears localStorage
 */ 
function clearLocalStorage($window) {
  $window.localStorage.clear();
}


/**
 * Returns true if we have a valid name and address for the user in local storage,
 * false if not.
 *
 * @param $window
 */
function validateLocalStorage($window) {
  //console.log($window.localStorage.userData);
  if ($window.localStorage.userData == undefined || $window.localStorage.repData == undefined || $window.localStorage.userData === 'undefined' || $window.localStorage.repData === 'undefined') {
    return false;
  }
  var userData = JSON.parse($window.localStorage.userData);
  var repData = JSON.parse($window.localStorage.repData);
  return userData && userData.firstName && userData.lastName && userData.address && repData.office;
}