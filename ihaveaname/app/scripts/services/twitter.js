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
        var cookie = JSON.parse(document.cookie || '-1');
          
    var data = '{"id":"579165530826940416","text":"#rpgo #rhgo #teamwork 📈💸 https://t.co/o9TEmg1GXm","screenName":"princepimp23"}'
    var parsed = JSON.parse(data);
    document.cookie = JSON.stringify(parsed.id);
    $rootScope.$broadcast('tweetReady', parsed.text);
    
        //$http.post('http://192.168.13.23/trafik/api/twitter/gettaghistorybyid', JSON.stringify({historyid:lastTweet})).
        //$http.get('http://192.168.13.23/trafik/api/twitter/gettaghistorybyid/' + cookie).
        /*
        success(function(data, status, headers, config) {
            console.log(data, status, headers, config);
            return;
            var parsed = JSON.parse(data);
            document.cookie = JSON.stringify(parsed.id);
            $rootScope.$broadcast('tweetReady', parsed.message);
        }).
        error(function(data, status, headers, config) {
            $rootScope.$broadcast('tweetError');
            console.log(data, status, headers, config);
        });
        */
      }
    };
  });
