angular.module('starter.controllers', [])

.controller('tweetCtrl', function($scope, tweet, $ionicModal, $sce) {
	$scope.$on('tweetReady', function(blah, tweet) {
	    $scope.tweet = tweet;
	});
	tweet.getTweet();
  // $ionicModal.fromTemplateUrl('templates/tweetout.html', {
  //   scope: $scope,
  //   animation: 'slide-in-up'
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });

  $scope.openModal = function(){
    if (!$scope.modal){
      console.log('no modal');
      var tweet1 = {text: 'Is she worth it? #ihaveavoice goo.gl/X6Nyi7', html: $sce.trustAsHtml('Is she worth it? <span class="thash">#ihaveavoice</span> <span class="tlink">goo.gl/X6Nyi7</span>')};
      var tweet2 = {text: 'Real People Getting Oppressed #rpgo #ihaveavoice goo.gl/X6Nyi7', html: $sce.trustAsHtml('Real People Getting Oppressed <span class="thash">#rpgo #ihaveavoice</span> <span class="tlink">goo.gl/X6Nyi7</span>')};
      var tweet3 = {text: 'Want to get dirty? #rpgo #ihaveavoice goo.gl/X6Nyi7', html: $sce.trustAsHtml('Want to get dirty? <span class="thash">#rpgo #ihaveavoice</span> <span class="tlink">goo.gl/X6Nyi7</span>')};
      $scope.tweetlist = [tweet1, tweet2, tweet3];
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
  // $scope.tweetlist = ['Is she worth it? #ihaveavoice goo.gl/X6Nyi7', 'Real People Getting Oppressed #rpgo #ihaveavoice', 'Want to get dirty? #ihaveavoice goo.gl/X6Nyi7'];
  };
  $scope.closeModal = function(outTweet) {
    console.log(outTweet);
    $scope.modal.hide();
    $scope.modal.remove();
    delete $scope.modal;
  };
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

.controller('shareCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})