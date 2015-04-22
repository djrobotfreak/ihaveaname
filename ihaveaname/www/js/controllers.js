function appendHashTags(_inTweet, _outTweet){
  console.log("appendHashTags: inputs: ",_inTweet, _outTweetText)
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
  Tweet.init().then(function(){
    TwitterService.initialize().then(function() {
      //Tweet.getRetweets();
      $scope.$on('retweetsReady', function(scopeInfo, data){
        console.log("retweet data", data);
      });
      $scope.images = 
        [
          {path:'img/sad-stockphoto2.jpg', fact: "The average age of a young woman being trafficked is 12–14 years old."},
          {path:'img/feet_in_chains_199358.jpg', fact: 'There are approximately 20 to 30 million slaves in the world today.'},
          {path:'img/money-95793.jpg', fact: 'Human trafficking generates $9.5 billion yearly in the United States.'}
        ];

      $scope.tweets = [];
      $scope.tweetlist = [
        'You know what it is. #rpgo tinyurl.com/qx8jero', 
        'Real People Getting Oppressed #rpgo tinyurl.com/qx8jero', 
        'She is worth it. #rpgo tinyurl.com/qx8jero'
      ];
    	$scope.$on('tweetReady', function(scopeInfo, newTweet) {
        if (!newTweet.image) {
          var image = $scope.images[Math.floor(Math.random() * $scope.images.length)];
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
