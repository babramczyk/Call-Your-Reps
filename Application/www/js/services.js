angular.module('starter.services', [])

.service('tweetWidgets', function() {

  this.loadAllWidgets = function() {

    /* widgets loader code you get when
     * declaring you widget with Twitter
     * this code is the same for all widgets
     * so calling it once will reference whatever
     * widgets are active in the current ng-view */

    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
  };

  this.destroyAllWidgets = function() {
    var $ = function (id) { return document.getElementById(id); };
    var twitter = $('twitter-wjs');
    if (twitter != null)
      twitter.remove();
  };
})

.factory('Query', function($http) {


  var getRepData = function(addr) {

    var repQuery = 'https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyBtBtBCDaQ5UGdcPAAee2XIljh5CI_-LrY&address=';

    return $http.get(repQuery + addr).then(function(res){

      var data = {};
      var raw = res.data;
      data.userAddrs = raw.normalizedInput;
      data.office = [];
      data.twitterHandles = [];

      // For each office, gather the data and add it
      for (var i in raw.offices) {
        //console.log(raw.offices[i].name);
        var newOffice = {name : raw.offices[i].name, holders : []}

        // For each office holder, add their information
        for (var j in raw.offices[i].officialIndices) {
          var newHolder = raw.officials[raw.offices[i].officialIndices[j]];

          // Add office title to holder (Redundant but nice to have)
          newHolder.officeName = raw.offices[i].name;

          newOffice.holders.push(newHolder);

          // For each channel of that office holder, add their twitter if they have it
          for (var k in newHolder.channels) {
            if(newHolder.channels[k].type == "Twitter") {
              data.twitterHandles.push(newHolder.channels[k].id);
            }
          }
        }
        data.office.push(newOffice);
      }
      return data;
    }, function(err){
      return err;
    });
  };

  return {getRepData: getRepData};
})

  .factory('Base64', function(){
    var self = this;
    self.encode = function (input) {
      // Converts each character in the input to its Unicode number, then writes
      // out the Unicode numbers in binary, one after another, into a string.
      // This string is then split up at every 6th character, these substrings
      // are then converted back into binary integers and are used to subscript
      // the "swaps" array.
      // Since this would create HUGE strings of 1s and 0s, the distinct steps
      // above are actually interleaved in the code below (ie. the long binary
      // string, called "input_binary", gets processed while it is still being
      // created, so that it never gets too big (in fact, it stays under 13
      // characters long no matter what).

      // The indices of this array provide the map from numbers to base 64
      var swaps = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"];
      var input_binary = "";      // The input string, converted to Unicode numbers and written out in binary
      var output = "";        // The base 64 output
      var temp_binary;        // Used to ensure the binary numbers have 8 bits
      var index;      // Loop variable, for looping through input
      for (index=0; index < input.length; index++){
        // Turn the next character of input into astring of 8-bit binary
        temp_binary = input.charCodeAt(index).toString(2);
        while (temp_binary.length < 8){
          temp_binary = "0"+temp_binary;
        }
        // Stick this string on the end of the previous 8-bit binary strings to
        // get one big concatenated binary representation
        input_binary = input_binary + temp_binary;
        // Remove all 6-bit sequences from the start of the concatenated binary
        // string, convert them to a base 64 character and append to output.
        // Doing this here prevents input_binary from getting massive
        while (input_binary.length >= 6){
          output = output + swaps[parseInt(input_binary.substring(0,6),2)];
          input_binary = input_binary.substring(6);
        }
      }
      // Handle any necessary padding
      if (input_binary.length == 4){
        temp_binary = input_binary + "00";
        output = output + swaps[parseInt(temp_binary,2)];
        output = output + "=";
      }
      if (input_binary.length == 2){
        temp_binary = input_binary + "0000";
        output = output + swaps[parseInt(temp_binary,2)];
        output = output + "==";
      }
      // Output now contains the input in base 64
      return output;
    };

    self.decode = function (input) {
      // Takes a base 64 encoded string "input", strips any "=" or "==" padding
      // off it and converts its base 64 numerals into regular integers (using a
      // string as a lookup table). These are then written out as 6-bit binary
      // numbers and concatenated together. The result is split into 8-bit
      // sequences and these are converted to string characters, which are
      // concatenated and output.
      input = input.replace("=","");      // Padding characters are redundant
      // The index/character relationship in the following string acts as a
      // lookup table to convert from base 64 numerals to Javascript integers
      var swaps = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var output_binary = "";
      var output = "";
      var temp_bin = "";
      var index;
      for (index=0; index < input.length; index++) {
        temp_bin = swaps.indexOf(input.charAt(index)).toString(2);
        while (temp_bin.length < 6) {
          // Add significant zeroes
          temp_bin = "0"+temp_bin;
        }
        while (temp_bin.length > 6) {
          // Remove significant bits
          temp_bin = temp_bin.substring(1);
        }
        output_binary = output_binary + temp_bin;
        while (output_binary.length >= 8) {
          output = output + String.fromCharCode(parseInt(output_binary.substring(0,8),2));
          output_binary = output_binary.substring(8);
        }
      }
      return output;
    };

    return self;
  })

  .factory('TwitterREST', function($http, $q, Base64){

    var self = this;
    var authorization = null;
    var consumerKey = "IpU9pbmcDVVL82A21Soz4KPqc"; 
    var consumerSecret = "W8qOfUvY7dx73LpCtPo9r6D1eACSUMkyFDnmS1JYRf0LW4AYrv";
    var twitterTokenURL = "https://api.twitter.com/oauth2/781310648-qJ2awr3HpenmlrUgGLNyEHJeYtA3r18WWQITp0UM";
    var twitterStreamURL = "https://api.twitter.com/1.1/lists/statuses.json="; //url query, this one is for hash tags
    var qValue = "%23belgrade"; //hash tag %23 is for #
    var numberOfTweets = "&count=10";

    self.sync = function () {
      var def = $q.defer();
      //get authorization token
      self.getAuthorization().then(function(){
        var req1 = {
          method: 'GET',
          url: twitterStreamURL+qValue+numberOfTweets,
          headers: {
            'Authorization': 'Bearer '+ authorization.access_token,
            'Content-Type': 'application/json'
          },
          cache:true
        };
        console.log("req1 " + req1);
        // make request with the token
        $http(req1).
        success(function(data, status, headers, config) {
          def.resolve(data);
        }).
        error(function(data, status, headers, config) {

          def.resolve(false);
        });
      });
      return def.promise;
    };

    self.getAuthorization = function () {
      var def = $q.defer();
      var base64Encoded;

      var combined = encodeURIComponent(consumerKey) + ":" + encodeURIComponent(consumerSecret);

      base64Encoded = Base64.encode(combined);

      // Get the token
      $http.post(twitterTokenURL,"grant_type=client_credentials",
        {headers: {'Authorization': 'Basic ' + base64Encoded,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}}).
      success(function(data, status, headers, config) {
        authorization = data;
        if (data && data.token_type && data.token_type === "bearer") {
          def.resolve(true);
        }
      }).
      error(function(data, status, headers, config) {
        def.resolve(false);
      });
      return def.promise;
    };

    return self;
  })

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
