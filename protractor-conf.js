"use strict";

exports.config = {
    allScriptsTimeout: 11000,

    specs: [
        "test/client/e2e/*.js"
    ],

    capabilities: {
        "browserName": "chrome"
    },

    baseUrl: "http://localhost:3001/",

    // TODO change this to beforeLaunch once this is released:
    // https://github.com/angular/protractor/commit/eedf50b48ca55f18e8555ce5aa64ad92b03887c8
    onPrepare: function() {
        console.log("Starting setup...");
    },

    // TODO change this to afterLaunch once this is released:
    // https://github.com/angular/protractor/commit/eedf50b48ca55f18e8555ce5aa64ad92b03887c8
    onComplete: function() {
        console.log("Starting cleanup...");
    },

    framework: "jasmine",

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};
