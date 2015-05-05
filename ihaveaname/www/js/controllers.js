function appendHashTags(_inTweet, _outTweet){
  var inTweet = _inTweet.text.toLowerCase();
  var outTweetLower = _outTweet.toLowerCase();
  var returnTweet = _outTweet.trim();
  var hashtags = _inTweet.hashTagList;
  for (var i = 0; i < hashtags.length; i++){
    if(inTweet.indexOf(hashtags[i]) != -1 && outTweetLower.indexOf(hashtags[i]) == -1){
      if ((returnTweet.length + hashtags[i].length + 1) <=140){
        returnTweet += " " + hashtags[i];
      }
    }
  }
  return returnTweet;
}



angular.module('starter.controllers', [])
.controller('tweetCtrl', function($scope, Tweet, TwitterService, $ionicModal, $ionicPlatform, $sce, $timeout) {
  $scope.loading = true;
  TwitterService.initialize().then(function() {
    Tweet.init().then(function(){
      //Tweet.getRetweets();
      $scope.$on('retweetsReady', function(scopeInfo, data){
        console.log("retweet data", data);
      });
      $scope.tweets = [];
      $scope.tweetlist = [
        'You know what it is. #rpgo tinyurl.com/qx8jero', 
        'Somebody come get her. #rpgo tinyurl.com/qx8jero', 
        'She is worth it. #rpgo tinyurl.com/qx8jero'
      ];
    	$scope.$on('tweetReady', function(scopeInfo, newTweet) {
        $scope.loading = false;
        if (!newTweet.image) {
          var image = IMAGES[Math.floor(Math.random() * IMAGES.length)];
          newTweet.image = image;
        }
        console.log('new tweet', newTweet);
        $scope.tweets.push(newTweet);
        if ($scope.tweets.length < 3){
          Tweet.getTweet(newTweet.id);
        }
    	});

      $scope.$on('retweetsReady', function(scopeInfo, replies) {
        $scope.replies = replies;
      });

    	Tweet.getTweet(window.localStorage.getItem('lastId') || '0');

      $scope.skip = function() {
        var lastId = $scope.tweets[0].id;
        if (lastId){
          window.localStorage.setItem('lastId', lastId);
        }
        Tweet.getTweet($scope.tweets[$scope.tweets.length - 1].id);
        $scope.tweets.splice(0, 1);
        if ($scope.modal){
          $scope.modal.remove();
          delete $scope.modal;
        }
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
      $scope.closeModal = function(outTweet){
        if (outTweet){
          outTweet = appendHashTags($scope.tweets[0], outTweet);
          console.log("Sending Tweet: ", outTweet);
          TwitterService.postTweet(outTweet).then(function () {
            console.log('Successfully tweeted response');
          }).catch(function (err) {
            if (err.status === 401) {
              TwitterService.storeUserToken(null);
              TwitterService.initialize().then(function() {
                TwitterService.postTweet(outTweet);
              });
            } else {
              console.error('Failed to tweet response', err);
            }
          }).finally(function () {        //wait for modal to close before removing element
            $scope.modal.hide().then(function(){
              $scope.modal.remove();
              delete $scope.modal;
              $timeout(function() {
                $scope.skip();
              }, 100);
            });
          });
        }
        else{
          $scope.modal.hide();
        }
      };
    });
  });
})
.controller('shareCtrl', function($scope){

});
