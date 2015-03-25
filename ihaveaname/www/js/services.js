angular.module('starter.services', [])
.factory('Tweet', function ($http, $rootScope) {
  // Public API here
  return {
    getTweet: function (lastId) {
      $http.get('http://ihaveaname.gear.host/api/twitter/gettaghistorybyid/' + lastId).
          success(function(data, status, headers, config) {
              $rootScope.$broadcast('tweetReady', data);
          }).
          error(function(data, status, headers, config) {
              $rootScope.$broadcast('tweetError');
          });
        },
    getRetweets: function() {
      $http.get('http://ihaveaname.gear.host/trafik/api/twitter/getretweetlist/').
          success(function(data, status, headers, config) {
              $rootScope.$broadcast('retweetsReady', data);
          }).
          error(function(data, status, headers, config) {
              $rootScope.$broadcast('retweetsError');
          });
        }   
      };
  })

.factory('TwitterService', function($cordovaOauth, $http, $q) {
    var twitterKey = "STORAGE.TWITTER.KEY";

    function storeUserToken(data) {
        window.localStorage.setItem(twitterKey, JSON.stringify(data));
    }

    function getStoredToken() {
        return window.localStorage.getItem(twitterKey);
    }

    return {
        initialize: function() {
            var deferred = $q.defer();
            var token = getStoredToken();

            if (token !== null) {
                deferred.resolve(true);
            } else {
              $cordovaOauth.twitter(
                TWITTER_AUTHENTICATION.clientId, 
                TWITTER_AUTHENTICATION.clientSecret,
                TWITTER_AUTHENTICATION.accessToken,
                TWITTER_AUTHENTICATION.accessSecret
              ).then(function(result) {
                  storeUserToken(result);
                  deferred.resolve(true);
              }, function(error) {
                  deferred.reject(false);
              });
            }
            return deferred.promise;
        },
        isAuthenticated: function() {
            return getStoredToken() !== null;
        },
        storeUserToken: storeUserToken,
        getStoredToken: getStoredToken
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
