"use strict";

angular.module("global").config(["$stateProvider", "$urlRouterProvider",
    function($stateProvider, $urlRouterProvider) {

        // Redirect to rootUrlPrefix when route not found
        $urlRouterProvider.otherwise(ApplicationConfiguration.rootUrlPrefix);

        $stateProvider.
        state("app", {
            abstract: true,
            templateUrl: "/assets/modules/global/views/app.client.view.html"
        });
    }
]);
