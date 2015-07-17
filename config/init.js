"use strict";

var glob = require("glob"),
    logger = require("../app/lib/logger")();

module.exports = function() {
    /**
     * Before we begin, lets set the environment variable.
     * We'll Look for a valid NODE_ENV variable and if one cannot be
     * found load the development NODE_ENV.
     */
    glob("./config/env/" + process.env.NODE_ENV + ".js", {
        sync: true
    }, function(err, environmentFiles) {
        if (!environmentFiles.length) {
            if (process.env.NODE_ENV) {
                logger.error("No configuration file found for '" +
                    process.env.NODE_ENV +
                    "' environment using development instead");
            } else {
                logger.error("NODE_ENV is not defined! Using " +
                    "default development environment");
            }

            process.env.NODE_ENV = "development";
        } else {
            logger.log("Application loaded using the '" +
                process.env.NODE_ENV + "' environment configuration");
        }
    });

    /**
     * Add our server node extensions.
     * This is done so we don't have to include the full name of
     * each file when we `require` them as a dependency.
     */
    require.extensions[".server.controller.js"] = require.extensions[".js"];
    require.extensions[".server.model.js"] = require.extensions[".js"];
    require.extensions[".server.routes.js"] = require.extensions[".js"];
};
