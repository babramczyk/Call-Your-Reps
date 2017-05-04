//---------- Config ----------//
/**
 * Clears localStorage
 */ 
function clearLocalStorage($window) {
  $window.localStorage.clear();
}

/*
 * Formats phone number to '+1-###-###-####'
 */
function formatPhoneNumber(num) {
	num = num.replace(/\D/g,'');
	num = '+1-' + num.substring(0,3) + '-' + num.substring(3,6) + '-' + num.substring(6,10);
	return num;
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