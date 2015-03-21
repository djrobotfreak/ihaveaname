'use strict';

/**
 * @ngdoc service
 * @name ihaveaname2App.Twitter
 * @description
 * # Twitter
 * Factory in the ihaveaname2App.
 */
angular.module('ihaveanameApp')
  .factory('Twitter', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
