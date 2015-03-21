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
        var cookie = JSON.parse(document.cookie || '0');

        $http.get('http://192.168.13.23/trafik/api/twitter/gettaghistorybyid/' + cookie).
            success(function(data, status, headers, config) {
                console.log('zaphod', data);
                $rootScope.$broadcast('tweetReady', data);
            }).
            error(function(data, status, headers, config) {
                $rootScope.$broadcast('tweetError');
            });
      }
    };
  });
