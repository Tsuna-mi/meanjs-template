"use strict";

var applicationConfiguration = require("./config/config");

module.exports = function(config) {
    function determineJUnitReporter() {
        if (process.env.CI) {
            return {
                outputFile: "test-reports/TEST-karma-tests.xml"
            };
        } else {
            return null;
        }
    }
    var JUNIT_REPORTER = determineJUnitReporter();

    config.set({

        files: applicationConfiguration.assets.lib.js.concat(applicationConfiguration.assets.js, applicationConfiguration.assets.tests),

        autoWatch: true,

        frameworks: ["jasmine"],

        browsers: ["Chrome", "Firefox"],

        junitReporter: JUNIT_REPORTER,

        plugins: [
            "karma-chrome-launcher",
            "karma-firefox-launcher",
            "karma-jasmine",
            "karma-junit-reporter"
        ]
    });
};
