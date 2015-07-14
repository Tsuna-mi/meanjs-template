/* global jasmine */
"use strict";

function determineCapabilities() {
    // In continuous integration, only run one browser, but otherwise
    // run the tests against all the browsers.
    if (process.env.CI) {
        return [{
            browserName: "firefox"
        }];
    } else {
        return [{
            browserName: "firefox"
        }, {
            browserName: "chrome"
        }];
    }
}
var CAPABILITIES = determineCapabilities();

exports.config = {
    allScriptsTimeout: 11000,

    specs: [
        "test/client/e2e/*.js"
    ],

    multiCapabilities: CAPABILITIES,

    baseUrl: "http://localhost:3001/",

    beforeLaunch: function() {
        console.log("Starting setup...");
    },

    onPrepare: function() {
        // in continuous integration, enable JUnit reporting (for Jenkins)
        if (process.env.CI) {
            // require the reporters here since it requires jasmine be global
            // (which it is at this point)
            require("jasmine-reporters");
            // add the JUnit reporter
            jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter(
                "test-reports", true, true));
        }
    },

    afterLaunch: function() {
        console.log("Starting cleanup...");
    },

    framework: "jasmine",

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};
