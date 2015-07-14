"use strict";

/*
 * The intent with this directive is to display a loading message (supplied by
 * the attribute "loading-text") to the user while we wait for the "hide-on-element"
 * to become truthy. Once the "hide-on-element" is truthy, the directive will
 * hide the loading message and the user should display the data for the page.
 */
angular.module("global").directive("csLoading", [
    function() {
        return {
            // restrict to an element
            restrict: "E",

            // replace the element with the template content
            replace: true,

            scope: true,

            templateUrl: "/assets/modules/global/views/loading.client.view.html",

            link: function($scope, elem, attrs) {
                // grab the user supplied input and bound it to our scope
                $scope.hideOnElement = $scope[attrs.hideOnElement];
                $scope.loadingText = attrs.loadingText;

                // watch the hideOnInput scope attribute and update our
                // element whenever it changes
                $scope.$watch(attrs.hideOnElement, function() {
                    $scope.hideOnElement = $scope[attrs.hideOnElement];
                });
            }
        };
    }
]);
