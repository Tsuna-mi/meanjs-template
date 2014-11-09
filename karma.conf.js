"use strict";

var applicationConfiguration = require("./config/config");

module.exports = function(config) {
    config.set({

        files: applicationConfiguration.assets.lib.js.concat(applicationConfiguration.assets.js, applicationConfiguration.assets.tests),

        autoWatch: true,

        frameworks: ["jasmine"],

        browsers: ["Chrome", "Firefox"],

        plugins: [
            "karma-chrome-launcher",
            "karma-firefox-launcher",
            "karma-jasmine"
        ]
    });
};
