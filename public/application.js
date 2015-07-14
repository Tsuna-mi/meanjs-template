"use strict";

// define the main module and include application dependencies
angular.module(ApplicationConfiguration.applicationModuleName,
    ApplicationConfiguration.applicationModuleVendorDependencies);

// global error handler
angular.module(ApplicationConfiguration.applicationModuleName).factory("errorInterceptor", ["$q", "$location",
    function($q, $location) {
        return {
            responseError: function(response) {
                $location.url("/error?reason=" + response.status);
                return $q.reject(response);
            }
        };
    }
]);

// configure the module / angular application
angular.module(ApplicationConfiguration.applicationModuleName).config(["$locationProvider", "localStorageServiceProvider", "$httpProvider",
    function($locationProvider, localStorageServiceProvider, $httpProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            // disable the requirement because of karma tests -- they fail once we
            // include the unauthorizedInterceptor unless the base URL is not required
            requireBase: false
        });

        // set the application name as the prefix for the local storage provider
        localStorageServiceProvider.setPrefix(ApplicationConfiguration.applicationModuleName);

        // configure our http interceptors
        $httpProvider.interceptors.push("errorInterceptor");
    }
]);

// Define the init function for starting up the application
angular.element(document).ready(function() {
    // init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
