angular.module('starter.controllers', [])
.controller('tweetCtrl', function($scope, Tweet, $ionicModal, $ionicPlatform, $twitterOAuth, $sce, $timeout) {
  $scope.tweets = [{text:'I am a test message #test @testing http://goo.gl/X6Nyi7'}, {text:'I am a test message #test @testing http://goo.gl/X6Nyi7'}, {text:'I am a test message #test @testing http://goo.gl/X6Nyi7'}, {text:'I am a test message #test @testing http://goo.gl/X6Nyi7'}];
  $scope.tweetlist = ['Whoa. #rpgo http://goo.gl/X6Nyi7', 'Real People Getting Oppressed #rpgo http://goo.gl/X6Nyi7', 'Is she worth it? http://goo.gl/X6Nyi7'];
	$scope.$on('tweetReady', function(blah, new_tweet) {
    $scope.tweets.push(new_tweet);
    if ($scope.tweets.length < 3){
      Tweet.getTweet();
    }
	});

  $scope.$on('retweetsReady', function(scopeInfo, replies) {
    $scope.replies = replies;
  });

	Tweet.getTweet();
  $scope.testOAuth = function(){
    // $ionicPlatform.ready(function() {
      $twitterOAuth.init('YyPIscWQb0Nzsb8Ih65Ry30og', 'wgly2AhXwetEawtISfu3AMTa228F01tzd1K0q6SxJfBEwDZpEE');
      $twitterOAuth.connect().then(function(data) {
        console.log('I am here, too', data);
        alert('yay');
      }, function(err) { console.log(err); });
    // });
  }
  $scope.skip = function(){
    Tweet.getTweet();
    $scope.tweets.splice(0, 1);
  }

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
  }
  $scope.closeModal = function(outTweet) {
    Tweet.getTweet();
    //wait for modal to close before removing element
    $timeout(function(){
      $scope.tweets.splice(0, 1);
    }, 400);
    $scope.modal.hide();
    $scope.modal.remove();
    delete $scope.modal;
  };
})

.controller('shareCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
