"use strict";

angular.module("home").config(["$stateProvider",
    function($stateProvider) {

        $stateProvider.
        state("home", {
            parent: "app",
            url: ApplicationConfiguration.rootUrlPrefix,
            templateUrl: "/assets/modules/home/views/home.client.view.html"
        });
    }
]);
