"use strict";

angular.module("global").controller("AppCtrl", ["$scope",
    function($scope) {

        // store some application configuration for all child scopes
        $scope.applicationConfiguration = {
            rootUrlPrefix: ApplicationConfiguration.rootUrlPrefix
        };

    }
]);
