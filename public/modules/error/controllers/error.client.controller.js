"use strict";

angular.module("error").controller("ErrorCtrl", ["$scope", "$state", "$rootScope",
    function($scope, $state, $rootScope) {

        $scope.startOver = function($event) {
            $event.currentTarget.blur();
            $state.go("home");
        };

    }
]);
