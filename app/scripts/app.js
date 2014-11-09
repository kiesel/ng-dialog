'use strict';

/**
 * @ngdoc overview
 * @name dialogAngularApp
 * @description
 * # dialogAngularApp
 *
 * Main module of the application.
 */
angular
  .module('dialogAngularApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/album/:title/', {
        templateUrl: 'views/album.html',
        controller: 'AlbumCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
