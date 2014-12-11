"use strict";

var BPromise = require("bluebird");

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

    afterLaunch: function() {
        console.log("Starting cleanup...");
    },

    framework: "jasmine",

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};
