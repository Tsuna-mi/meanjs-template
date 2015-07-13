"use strict";

// define the main module and include application dependencies
angular.module(ApplicationConfiguration.applicationModuleName,
    ApplicationConfiguration.applicationModuleVendorDependencies);

// our check to redirect on any API calls that recieve a 401 response code (unauthorized)
angular.module(ApplicationConfiguration.applicationModuleName).factory("unauthorizedInterceptor", ["$q", "$location",
    function($q, $location) {
        return {
            responseError: function(response) {
                // if the response status is 401 (unauthorized)
                if (response.status === 401) {
                    /*
                     * We're using $location here rather than $state because
                     * we'll end up in an infinite loop if we use $state. This is
                     * because of our AuthenticationResolver, which is called each
                     * resolve of a state, including those that we redirect to here.
                     */
                    // If we're not currently on the login page
                    if ($location.path() !== "/") {
                        // send the user to the login page with the reason code
                        $location.url("/?reason=401");
                    }
                }
                return $q.reject(response);
            }
        };
    }
]);

// global error handler
angular.module(ApplicationConfiguration.applicationModuleName).factory("errorInterceptor", ["$q", "$location",
    function($q, $location) {
        return {
            responseError: function(response) {
                // if the response status is NOT 401 (any other error status)
                if (response.status !== 401) {
                    /*
                     * We're using $location here rather than $state because
                     * we'll end up in an infinite loop if we use $state. This is
                     * because of our AuthenticationResolver, which is called each
                     * resolve of a state, including those that we redirect to here.
                     */
                    // send the user to the login page with the reason code
                    $location.url("/error?reason=" + response.status);
                }
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
        $httpProvider.interceptors.push("unauthorizedInterceptor");
        $httpProvider.interceptors.push("errorInterceptor");
    }
]);

// Define the init function for starting up the application
angular.element(document).ready(function() {
    // init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
