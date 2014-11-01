'use strict';

/**
 * @ngdoc function
 * @name dialogAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dialogAngularApp
 */
angular.module('dialogAngularApp')
    .factory('PageService', ['$q', '$http', '$log', function($q, $http, $log) {
        return function($index) {
            $log.log('>>> PageService; index= ', $index);
            
            var deferred = $q.defer();
            $http.get('data/page_' + $index + '.idx').then(function(response) {
                var page = PHPUnserialize.unserialize(response.data);
                $log.log('<<< ', page);
                deferred.resolve(page);
            });

            return deferred.promise;
        }
    }])
    .controller('MainCtrl', ['$scope', '$http', '$log', 'PageService', function ($scope, $http, $log, PageService) {
        PageService(0).then(function(page) {
            $log.log(page.entries);
            $scope.entries = page.entries;
        });

        // $http.get('data/page_0.idx').success(function(data) {
        //     var obj= PHPUnserialize.unserialize(data);
        //     $log.log(obj);

        //     $scope.entries= obj;
        // });
    }])
    .controller('PageEntryCtrl', ['$scope', '$log', function($scope, $log) {
        $log.log('Processing ' + $scope.name);
    }]);
