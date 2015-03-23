angular.module('starter.services', [])
.factory('Tweet', function ($http, $rootScope) {
  // Public API here
  return {
    getTweet: function () {
      var cookie = 0;
      $http.get('http://192.168.13.23/trafik/api/twitter/gettaghistorybyid/' + cookie).
          success(function(data, status, headers, config) {
              console.log('zaphod', data);
              cookie = data.id;
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
