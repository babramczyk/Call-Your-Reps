// ------------ USER SPECIFIC FUNCTIONS ------------ //

/**
 * Return JSON object with firstName, lastName. Blank strings for any that haven't been set
 */
function getUserName() {
  // TODO: Database person
}

/**
 * Return JSON object with address, city, state, zip. Blank strings for any that haven't been set
 */
function getUserAddress() {
  // TODO: Database person
}

function setUserName(firstName, lastName) {
  // TODO: Database person
}

function setUserAddress(address, city, state, zip) {
  // TODO: Database person
}

/**
 * Uses locally stored address information to find polling place
 */
function getPollingPlace() {
  // TODO: Brian
}

/**
 * Uses locally stored address information to find upcoming election info
 */
function getUpcomingElections() {
  // TODO: Brian
}


// -------- REPRESENTATIVE QUERY FUNCTIONS -------- //

/**
 * Use locally stored address to get/return Senate reps array
 */
function getSenateReps() {
  // TODO: Brian
}

/**
 * Use locally stored address to get/return House reps array
 */
function getHouseReps() {
  // TODO: Brian
}

/**
 * Returns a link to an image of the representative given their name.
 * (Not entirely sure if the Google API supports images for this kind of thing)
 */
function getRepImgSrc(repName) {
  // TODO: Brian
}

function getRepPhone(repName) {
  // TODO: Brian
}

function getRepEmailAddress(repName) {
  // TODO: Brian
}



//---------- Config ----------//

function clearLocalStorage($window) {
  $window.localStorage.clear();
}

/**
 * Checks to see if a given address JSON object is valid.
 * @param address
 */
function isValidAddress(address) {

}

/**
 * Returns true if we have a valid name and address for the user in local storage,
 * false if not.
 *
 * @param $window
 */
function validateLocalStorage($window) {
  console.log($window.localStorage.userData);
  if ($window.localStorage.userData == undefined || $window.localStorage.repData == undefined || $window.localStorage.userData === 'undefined' || $window.localStorage.repData === 'undefined') {
    return false;
  }
  var userData = JSON.parse($window.localStorage.userData);
  var repData = JSON.parse($window.localStorage.repData);
  return userData && userData.firstName && userData.lastName && userData.address && repData.office;
}