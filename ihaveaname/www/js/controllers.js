angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, tweet) {
	$scope.$on('tweetReady', function(blah, tweet) {
	    $scope.tweet = tweet;
	});
	tweet.getTweet();
})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})