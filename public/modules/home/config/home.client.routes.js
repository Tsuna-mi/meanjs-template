"use strict";

angular.module("home").config(["$stateProvider",
    function($stateProvider) {

        $stateProvider.
        state("home", {
            parent: "app",
            abstract: true,
            templateUrl: "/assets/modules/home/views/home.client.view.html"
        }).
        state("home.dashboard", {
            url: ApplicationConfiguration.rootUrlPrefix,
            templateUrl: "/assets/modules/home/views/dashboard.client.view.html"
        });
    }
]);
