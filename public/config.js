"use strict";

// Init the application configuration module for AngularJS application

/* jshint unused: false */
var ApplicationConfiguration = (function() {
    var _ = window._;
    // Init module configuration options
    var applicationModuleName = "meanjs-template";
    var applicationModuleVendorDependencies = ["ngResource", "ui.router", "LocalStorageModule", "ngCookies"];

    // Add a new vertical module
    var registerModule = function(moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return _.defaults(
        {
            environment: window.ENVIRONMENT || "production",
            applicationModuleName: applicationModuleName,
            applicationModuleVendorDependencies: applicationModuleVendorDependencies,
            registerModule: registerModule,
            // This route MUST end with a "/"
            rootUrlPrefix: "/"
        },
        window.CLIENT_CONFIG
    );
})();
