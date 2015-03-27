"use strict";

var debugCaller = require("debug-caller"),
    projectConfig = require("../../package.json");

// enable the app namespace by default
debugCaller.debug.enable(projectConfig.name + "*");

module.exports = function() {
    // set a depth of 2 to avoid using this file within debug statements
    // (since this is just a passthrough for logging)
    return debugCaller(projectConfig.name, {
        depth: 2
    });
};
