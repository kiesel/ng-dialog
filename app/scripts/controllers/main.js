'use strict';

/**
 * @ngdoc function
 * @name dialogAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dialogAngularApp
 */
angular.module('dialogAngularApp')
    .factory('PageService', ['$http', '$log', function ($http, $log) {
        return function ($index) {
            $log.log('>>> PageService; index= ' + $index);
            
            var responsePromise = $http.get('data/page_' + $index + '.idx', {
                transformResponse: function (value) {
                    try {
                        return PHPUnserialize.unserialize(value);
                    } catch (e) {
                        $log.error('Something went wrong deserializing the data: ', e);
                        $log.error(value);
                    }
                }
            });

            return responsePromise;
        };
    }])
    .factory('EntriesService', ['$http', '$log', function ($http, $log) {
        return function ($entryName) {
            $log.log('>>> EntriesService; name= ' + $entryName);

            var responsePromise = $http.get('data/' + $entryName + '.dat', {
                transformResponse: function (value) {
                    try {
                        return PHPUnserialize.unserialize(value);
                    } catch (e) {
                        $log.error('Something went wrong deserializing the data: ', e);
                        $log.error(value);
                    }
                }
            });

            return responsePromise;
        };
    }])
    .controller('MainCtrl', ['$scope', '$log', 'PageService', function ($scope, $log, PageService) {
        $scope.totalEntries = 0;
        $scope.perPage = 0;
        $scope.entries = {};

        PageService(0).success(function (data) {
            $log.log('Received page entries: ', data);
            $scope.totalEntries = data.total;
            $scope.perPage = data.perpage;
            $scope.entries = data.entries;
        });
    }])
    .controller('PageEntryCtrl', ['$scope', '$log', 'EntriesService', function ($scope, $log, EntriesService) {
        $log.log('Processing ' + $scope.entry);

        EntriesService($scope.entry).success(function (data) {
            $log.log('Received entry: ', data);

            $scope.data = data;
        });
    }])
    .directive('dialogEntryDisplay', function() {
        return {
            // template: 'Hello!<h4>{{ name +  ' + ' + entry }}</h4>'
            templateUrl: 'views/partials/main-entry-display.html'
        };
    });
