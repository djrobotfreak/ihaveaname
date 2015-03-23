angular.module('starter.services', [])

// .factory('Chats', function() {
//   // Might use a resource here that returns a JSON array

//   // Some fake testing data
//   var chats = [{
//     id: 0,
//     name: 'Ben Sparrow',
//     lastText: 'You on your way?',
//     face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
//   }, {
//     id: 1,
//     name: 'Max Lynx',
//     lastText: 'Hey, it\'s me',
//     face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
//   }, {
//     id: 2,
//     name: 'Andrew Jostlin',
//     lastText: 'Did you get the ice cream?',
//     face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
//   }, {
//     id: 3,
//     name: 'Adam Bradleyson',
//     lastText: 'I should buy a boat',
//     face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
//   }, {
//     id: 4,
//     name: 'Perry Governor',
//     lastText: 'Look at my mukluks!',
//     face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
//   }];

//   return {
//     all: function() {
//       return chats;
//     },
//     remove: function(chat) {
//       chats.splice(chats.indexOf(chat), 1);
//     },
//     get: function(chatId) {
//       for (var i = 0; i < chats.length; i++) {
//         if (chats[i].id === parseInt(chatId)) {
//           return chats[i];
//         }
//       }
//       return null;
//     }
//   };
// })
.factory('Tweet', function ($http, $rootScope) {
  // Public API here
  var cookie = '0';
  return {
    getTweet: function () {
      console.log('old cookie', cookie);
      $http.get('http://192.168.13.23/trafik/api/twitter/gettaghistorybyid/' + cookie).
          success(function(data, status, headers, config) {
              cookie = data.id;
              console.log('new cookie', cookie);
              $rootScope.$broadcast('tweetReady', data);
          }).
          error(function(data, status, headers, config) {
              $rootScope.$broadcast('tweetError');
          });
    },
    getRetweets: function() {
      $http.get('http://192.168.13.23/trafik/api/twitter/getretweetlist/').
          success(function(data, status, headers, config) {
              $rootScope.$broadcast('retweetsReady', data);
          }).
          error(function(data, status, headers, config) {
              $rootScope.$broadcast('retweetsError');
          });
    }   
  };
})
.factory('TwitterService', function($cordovaOauth, $cordovaOauthUtility, $http, $resource, $q) {
    // 1
    var twitterKey = "STORAGE.TWITTER.KEY";
    var clientId = 'itfTbo4Uoq9pRKxu3dtYAgq9i';
    var clientSecret = 'SSqoAzrcqtMeNoB54kRV0HdMzMHQBzXgBgsoiLtDoP7TkteLe6';

    // 2
    function storeUserToken(data) {
        window.localStorage.setItem(twitterKey, JSON.stringify(data));
    }

    function getStoredToken() {
        return window.localStorage.getItem(twitterKey);
    }

    // 3
    function createTwitterSignature(method, url) {
        var token = angular.fromJson(getStoredToken());
        var oauthObject = {
            oauth_consumer_key: clientId,
            oauth_nonce: $cordovaOauthUtility.createNonce(10),
            oauth_signature_method: "HMAC-SHA1",
            oauth_token: token.oauth_token,
            oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
            oauth_version: "1.0"
        };
        var signatureObj = $cordovaOauthUtility.createSignature(method, url, oauthObject, {}, clientSecret, token.oauth_token_secret);
        $http.defaults.headers.common.Authorization = signatureObj.authorization_header;
    }
    return {
        // 4
        initialize: function() {
            var deferred = $q.defer();
            var token = getStoredToken();

            if (token !== null) {
                deferred.resolve(true);
            } else {
                console.log('slarti', clientId, clientSecret);
                $cordovaOauth.twitter(clientId, clientSecret).then(function(result) {
                  
                    storeUserToken(result);
                    deferred.resolve(true);
                }, function(error) {
                    deferred.reject(false);
                });
            }
            return deferred.promise;
        },
        // 5
        isAuthenticated: function() {
            return getStoredToken() !== null;
        },
        storeUserToken: storeUserToken,
        getStoredToken: getStoredToken,
        createTwitterSignature: createTwitterSignature
    };
})
.filter('tweetLinky',['$filter', '$sce',
    function($filter, $sce) {
        return function(text, target) {
            if (!text) return text;
            var replacedText = text;
            // Turn urls blue
            var httpReplace = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
            replacedText = replacedText.replace(httpReplace, ' <span class="tlink">$1</span>');
            //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
            var wwwReplace = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
            replacedText = replacedText.replace(wwwReplace, ' <span class="tlink">$2</span>');
            // replace #hashtags
            var hashReplace = /(^|\s)#(\w*[a-zA-Z_]+\w*)/gim;
            replacedText = replacedText.replace(hashReplace, ' <span class="thash">#$2</span>');
            // replace @mentions
            var atReplace = /(^|\s)\@(\w*[a-zA-Z_]+\w*)/gim;
            replacedText = replacedText.replace(atReplace, ' <span class="thash">@$2</span>');
            return $sce.trustAsHtml(replacedText);
        };
    }
]);



