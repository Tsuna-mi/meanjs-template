"use strict";

angular.module("error").config(["$stateProvider",
    function($stateProvider) {

        $stateProvider.
        state("error", {
            parent: "app",
            url: ApplicationConfiguration.rootUrlPrefix + "error",
            templateUrl: "/assets/modules/error/views/error.client.view.html"
        });
    }
]);
