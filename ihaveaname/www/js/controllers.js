angular.module('starter.controllers', [])
.controller('tweetCtrl', function($scope, Tweet, TwitterService, $ionicModal, $ionicPlatform, $sce, $timeout) {
  TwitterService.initialize().then(function() {
    $scope.tweets = [];
    $scope.tweetlist = [
      'You know what it is. #rpgo http://goo.gl/X6Nyi7', 
      'Real People Getting Oppressed #rpgo http://goo.gl/X6Nyi7', 
      'She is worth it. #rpgo http://goo.gl/X6Nyi7'
    ];
  	$scope.$on('tweetReady', function(scopeInfo, new_tweet) {
      $scope.tweets.push(new_tweet);
      if ($scope.tweets.length < 3){
        Tweet.getTweet(new_tweet.Id);
      }
  	});

    $scope.$on('retweetsReady', function(scopeInfo, replies) {
      $scope.replies = replies;
    });
  	Tweet.getTweet(window.localStorage.getItem('lastId') || '0');  

    $scope.skip = function() {
      var lastId = $scope.tweets[0].Id;
      window.localStorage.setItem('lastId', lastId);
      Tweet.getTweet($scope.tweets[$scope.tweets.length - 1].Id);
      $scope.tweets.splice(0, 1);
    };

    $scope.openModal = function(){
      if (!$scope.modal){
        $ionicModal.fromTemplateUrl('templates/tweetout.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      }
      else{
        $scope.modal.show();
      }
    };
    $scope.closeModal = function(outTweet) {
      //wait for modal to close before removing element
      $timeout(function(){
        $scope.skip();
      }, 400);
      $scope.modal.hide();
      $scope.modal.remove();
      delete $scope.modal;
    };
  });
})
.controller('shareCtrl', function($scope){

});
