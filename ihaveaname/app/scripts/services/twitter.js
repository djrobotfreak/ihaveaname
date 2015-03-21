'use strict';

/**
 * @ngdoc service
 * @name ihaveaname2App.Twitter
 * @description
 * # Twitter
 * Factory in the ihaveaname2App.
 */
angular.module('ihaveanameApp')
  .factory('tweet', function ($http, $rootScope) {
    // Public API here
    return {
      getTweet: function () {
        var cookie = JSON.parse(document.cookie);
        var lastTweet = (cookie && cookie.lastTweet) || -1;
        $http.post('http://192.168.13.23/trafik/api/twitter/gettimeline', {msg:JSON.stringify(lastTweet)}).
        success(function(data, status, headers, config) {
            console.log(data, status, headers, config);
            return;
            var parsed = JSON.parse(data);
            document.cookie = JSON.stringify(parsed.id);
            $rootScope.broadcast('tweetReady', parsed.message);
        }).
        error(function(data, status, headers, config) {
            $rootScope.broadcast('tweetError');
            console.log(data, status, headers, config);
        });
      }
    };
  });
