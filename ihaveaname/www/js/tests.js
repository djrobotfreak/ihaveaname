describe('factory: Tweet', function() {
  var tweet;
  
  beforeEach(inject(function(_logger_) {
    tweet = _tweet_;
  }));
  
  it('should retreive a new tweet', function() {
    var eventEmitted = false;
    $rootScope.$on("tweetReady", function() {
       eventEmitted = true;
    });
    tweet.getTweet();
    expect(eventEmitted).toBe(true);
  });
  
  it('should retreive new reply tweets', function() {
    var eventEmitted = false;
    $rootScope.$on("retweetsReady", function() {
       eventEmitted = true;
    });
    //run code to test
    expect(eventEmitted).toBe(true);
  });
});