'use strict';

/**
 * @ngdoc function
 * @name ihaveaname2App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ihaveaname2App
 */
angular.module('ihaveanameApp')
  .controller('MainCtrl', function ($scope, tweet, $rootScope) {
    $scope.$on('tweetReady', function(blah, tweet) {
        $scope.tweet = tweet;
    });
    
    tweet.getTweet();
  });
