'use strict';

/**
 * @ngdoc function
 * @name ihaveaname2App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ihaveaname2App
 */
angular.module('ihaveanameApp')
  .controller('MainCtrl', function ($scope, tweet) {
    tweet.getTweet();
    
    $scope.$on('tweetReady', function(tweet) {
        $scope.tweet = tweet;
    });
    $scope.testTweet = function() {
        tweet.getTweet();
    }
  });
