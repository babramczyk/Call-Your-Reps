angular.module('starter.services', [])

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
