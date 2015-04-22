angular.module('starter.services', [])
// .factory('Tweet_Old', function ($http, $rootScope) {
//   // Public API here
//   var hashTagList = ["#rpgo", "#rhgo", "#pimp", "#downforthecrown", "#pgo", "#hgo"];
//   return {
//     getTweet: function (lastId) {
//       $http.get('http://ihaveaname.gear.host/api/twitter/gettaghistorybyid/' + lastId).
//           success(function(data, status, headers, config) {
//               $rootScope.$broadcast('tweetReady', data);
//           }).
//           error(function(data, status, headers, config) {
//               $rootScope.$broadcast('tweetError');
//           });
//     },
//     getRetweets: function() {
//       $http.get('http://ihaveaname.gear.host/trafik/api/twitter/getretweetlist/').
//           success(function(data, status, headers, config) {
//               $rootScope.$broadcast('retweetsReady', data);
//           }).
//           error(function(data, status, headers, config) {
//               $rootScope.$broadcast('retweetsError');
//           });
//     },
//     getHashTagList: function(){
//       return hashTagList;
//     },
//     loadHashTagList: function(){
//           //load and set hashTagList here;
//     }   
//   };
// })


.factory('Tweet', ['$rootScope', '$http', '$q', '$window', function ($rootScope,$http, $q, $window) {
    var serviceBase = TWEET_AUTHENTICATION.apiServiceBaseUri;
    var _initialzation = {
        accessToken: "",
        isInitialized: false,
        userName: ""
    };
    return{
      getTweet: function (lastId) {
        $http.get(serviceBase + 'api/Twitter/GetTagHistoryById/' + lastId).
          success(function(data, status, headers, config) {
            var new_tweet = data[0];
            new_tweet.image = data.image;
              $rootScope.$broadcast('tweetReady', new_tweet);
          }).
          error(function(data, status, headers, config) {
              $rootScope.$broadcast('tweetError');
          });
      },
      getRetweets: function() {
        $http.get(serviceBase + 'api/Twitter/getRetweetList/').
            success(function(data, status, headers, config) {
                $rootScope.$broadcast('retweetsReady', data);
            }).
            error(function(data, status, headers, config) {
                $rootScope.$broadcast('retweetsError');
            });
      },
      init: function(){
        console.log('Initializing...');
        //alert(loginData.userName + ' : ' + loginData.password);
        var data = "grant_type=password&client_id=" + TWEET_AUTHENTICATION.clientId + "&client_secret=" + TWEET_AUTHENTICATION.clientSecret;
        var deferred = $q.defer();
        $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
            _initialzation.accessToken = response.access_token;
            _initialzation.isInitialized = true;
            $window.sessionStorage.token = response.access_token;
            $window.sessionStorage.session = response.session_key;
            console.log('getting new token', response.access_token);
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;
      }
    }

    // var _hello = function () {
    //     return "Hello ";
    // };

    // var _runApi = function (apiTest) {
    //     return $http.get(serviceBase + apiTest).then(function (results) {
    //          // return results;
    //          console.log("results", results);
    //          return results;
    //     },
    //     function (httpError) {
    //         throw httpError;
    //     });
    // };

    // var _getTweet = function (lastId) {
    //     //alert(serviceBase + apiTest);
    //     return $http.get(serviceBase + 'api/Twitter/GetTagHistoryById/'+lastId).then(function (results) {
    //         // var data = JSON.stringify(results);
    //         var obj = JSON.parse(data);
    //         //alert(obj.data[0].id);
    //         $rootScope.$broadcast('tweetReady', obj);
    //         return results;
    //     },
    //     function (httpError) {
    //         throw httpError;
    //     });
    // };

    // apitestsServiceFactory.GetNextTweet = _getTweet;
    // apitestsServiceFactory.RunApi = _runApi;
    // apitestsServiceFactory.Hello = _hello;

    // return apitestsServiceFactory;
}])




// .factory('initService', ['$http', '$q', '$rootScope','$window', function ($http, $q, $rootScope, $window) {

//     var serviceBase = TWEET_AUTHENTICATION.apiServiceBaseUri;
//     var initServiceFactory = {};

//     var _initialzation = {
//         accessToken: "",
//         isInitialized: false,
//         userName: ""
//     };

//     var _init = function () {
//         console.log('Initializing...');
//         //alert(loginData.userName + ' : ' + loginData.password);
//         var data = "grant_type=password&client_id=" + TWEET_AUTHENTICATION.clientId + "&client_secret=" + TWEET_AUTHENTICATION.clientSecret;
//         var deferred = $q.defer();
//         $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
//             _initialzation.accessToken = response.access_token;
//             _initialzation.isInitialized = true;
//             $window.sessionStorage.token = response.access_token;
//             $window.sessionStorage.session = response.session_key;
//             alert(response.session_key);
//             deferred.resolve(response);
//         }).error(function (err, status) {
//             deferred.reject(err);
//         });
//         return deferred.promise;
//     };
 
//     initServiceFactory.Initialization = _initialzation;
//     initServiceFactory.Init = _init;

//     return initServiceFactory;
// }])



.factory('authInterceptorService',['$rootScope', '$q', '$window', '$location', function ($rootScope, $q, $window, $location) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                config.headers['session_key'] = $window.sessionStorage.session;
            }

            if (config.method == 'GET') {
                var separator = config.url.indexOf('?') === -1 ? '?' : '&';
                config.url = config.url + separator + 'noCache=' + new Date().getTime();
            }

            return config;
        },
        responseError: function (response) {
            if (response.status === 401) {
                console.log("401 error", response);
                $rootScope.$broadcast('reinitialize');
            }
            return $q.reject(response);
        }
    };
}])



.factory('TwitterService', function($cordovaOauth, $cordovaOauthUtility, $http, $resource, $q) {
    var twitterKey = "STORAGE.TWITTER.KEY";

    function storeUserToken(data) {
      if (data == null) {
        window.localStorage.removeItem(twitterKey);
      } else {
        window.localStorage.setItem(twitterKey, JSON.stringify(data));
      }
    }

    function getStoredToken() {
        var token = window.localStorage.getItem(twitterKey);
        return token && JSON.parse(token);
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
                  console.error('error', error);
                  deferred.reject(false);
              });
            }
            return deferred.promise;
        },
        isAuthenticated: function() {
            return getStoredToken() !== null;
        },
        postTweet: function(tweetText) {
            var tweetURL = 'https://api.twitter.com/1.1/statuses/update.json';
            var token = getStoredToken();
            var oauthObject = {
                oauth_consumer_key: TWITTER_AUTHENTICATION.clientId,
                oauth_nonce: $cordovaOauthUtility.createNonce(32),
                oauth_signature_method: "HMAC-SHA1",
                oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
                oauth_token: token.oauth_token,
                oauth_version: "1.0",
                status: tweetText,
                'trim_user': 'true'
            };
            var signatureObj = $cordovaOauthUtility.createSignature('POST', tweetURL, oauthObject, oauthObject, TWITTER_AUTHENTICATION.clientSecret, token.oauth_token_secret);
            $http.defaults.headers.common.Authorization = signatureObj.authorization_header;

            return $resource(tweetURL, {'status': tweetText, 'trim_user': 'true'}).save().$promise;
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
            var tinyReplace = new RegExp("(http://(bit\.ly|t\.co|lnkd\.in|tcrn\.ch)\S*)\b");
            replacedText = replacedText.replace(httpReplace, ' <span class="tlink">$1</span>');
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
