'use strict';

/**
 * @ngdoc function
 * @name dialogAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dialogAngularApp
 */
angular.module('dialogAngularApp')
    .value('appConfig', {
        imageBaseUri: 'http://s3.dialog.kiesel.name.s3.amazonaws.com'
    })
    .factory('PageService', ['$http', '$log', function ($http, $log) {
        return function ($index) {
            $log.log('>>> PageService; index= ' + $index);
            
            var responsePromise = $http.get('data/page_' + $index + '.idx.json');
            return responsePromise;
        };
    }])
    .factory('EntriesService', ['$http', '$log', function ($http, $log) {
        return function ($entryName) {
            $log.log('>>> EntriesService; name= ' + $entryName);

            var responsePromise = $http.get('data/' + $entryName + '.dat.json');
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
    .controller('AlbumCtrl', ['$scope', '$log', '$routeParams', 'EntriesService', 'appConfig', function($scope, $log, $routeParams, EntriesService, appConfig) {
        $log.log('Album:', $routeParams.title);
        $scope.appConfig = appConfig;

        EntriesService($routeParams.title).success(function (data) {
            $scope.entry = data;
            $scope.meta = {
                numChapters: data.chapters.length,
                numPictures: 0
            }

            // Count number of images
            for (var i in data.chapters) {
                $scope.meta.numPictures += data.chapters[i].images.length;
            }

            $log.log('Data', $scope.meta, $scope.entry);
        });
    }])
    .directive('dialogEntryDisplay', function() {
        return {
            templateUrl: 'views/partials/main-entry-display.html'
        };
    })
    .directive('dialogImageHighlight', ['appConfig', function(appConfig) {
        return {
            template: '<a href="#" class="thumbnail"><img alt="Loading highlight ..." ng-src="' + appConfig.imageBaseUri + '/albums/{{ data.name }}/{{ highlight.name }}"/></a>'
        }
    }]);
