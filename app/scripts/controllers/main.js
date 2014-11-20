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
        imageBaseUri: 'http://s3.dialog.kiesel.name.s3.amazonaws.com',
        siteTitle: 'dialog.kiesel.name'
    })
    .factory('PageService', ['$http', '$log', function ($http, $log) {
        return function () {
            $log.log('>>> PageService called.');
            
            var responsePromise = $http.get('data/allpages.json', { cache: true });
            return responsePromise;
        };
    }])
    .factory('EntriesService', ['$http', '$log', function ($http, $log) {
        return function ($entryName) {
            $log.log('>>> EntriesService; name= ' + $entryName);

            var responsePromise = $http.get('data/' + $entryName + '.dat.json', { cache: true });
            return responsePromise;
        };
    }])
    .controller('MainCtrl', ['$scope', '$log', 'PageService', 'appConfig', function ($scope, $log, PageService, appConfig) {
        $scope.appConfig = appConfig;
        $scope.entries = {};

        PageService().success(function (data) {
            $log.log('Received page entries: ', data);
            $scope.totalEntries = data.length;

            var entries = [];
            for (var index in data) {
                entries.push({
                    key: index,
                    data: data[index]
                });
            }

            $scope.entries = entries;
        });
    }])
    .controller('PageEntryCtrl', ['$scope', '$log', 'EntriesService', function ($scope, $log, EntriesService) {
        $log.log('Processing ', $scope.element);

        EntriesService($scope.element.data).success(function (data) {
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
    .controller('AlbumImageCtrl', ['$scope', '$log', '$routeParams', 'EntriesService', 'appConfig', function ($scope, $log, $routeParams, EntriesService, appConfig) {
        $log.log('Album:', $routeParams.title, 'Image:', $routeParams.image);
        $scope.appConfig = appConfig;

        EntriesService($routeParams.title).success(function (data) {
            $log.log(data);
            $scope.album = data;

            var images = [];

            // Build array of images over chapters
            for (var i in data.chapters) {
                var chapter = data.chapters[i];
                for (var j in chapter.images) {
                    var img = chapter.images[j];

                    images.push({
                        chapter: chapter,
                        image: img
                    });
                }
            }

            // Find image in question, set pointers to next ones
            images.every(function (image, index, array) {
                if (image.image.name == $routeParams.image) {
                    $scope.image= image;

                    if (0 < index) {
                        $log.log('Prev image:', array[index- 1]);
                        $scope.prevImage = array[index- 1];
                    }

                    if (index + 1 <= array.length) {
                        $scope.nextImage = array[index+ 1];
                    }

                    return false;
                }

                // Skip to next one ...
                return true;
            });


            $log.log('images', images);
            $scope.images = images;
        });
    }])
    .directive('dialogEntryDisplay', function() {
        return {
            templateUrl: 'views/partials/main-entry-display.html'
        };
    })
    .directive('imgPreload', ['$rootScope', function($rootScope) {
        return {
            restrict: 'A',
            scope: {
                ngSrc: '@'
            },
            link: function (scope, element, attrs) {
                element.on('load', function() {
                    element.addClass('in');
                }).on('error', function() {
                    // TODO Signal error
                });

                scope.$watch('ngSrc', function(newVal) {
                    element.removeClass('in');
                });
            }
        };
    }]);
