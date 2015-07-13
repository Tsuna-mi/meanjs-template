"use strict";

var debugCaller = require("debug-caller"),
    projectConfig = require("../../package.json");

// enable the app namespace by default
debugCaller.debug.enable(projectConfig.name + "*");

module.exports = function() {
    var logger;

    // set a depth of 2 to avoid using this file within debug statements
    // (since this is just a passthrough for logging)
    logger = debugCaller(projectConfig.name, {
        depth: 2
    });

    // we're going to inject the domain ID in the log message if we can
    function includeDomainID(args) {
        if (process.domain && typeof args[0] === "string") {
            args[0] = process.domain.id + " " + args[0];
        }
    }

    return {
        log: function() {
            includeDomainID(arguments);
            logger.log.apply(this, arguments);
        },
        error: function() {
            includeDomainID(arguments);
            logger.error.apply(this, arguments);
        }
    };
};
