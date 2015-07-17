"use strict";

require("./config/init")();

var config = require("./config/config"),
    VError = require("verror"),
    path = require("path"),
    mongoose = require("mongoose"),
    logger = require("./app/lib/logger.js")();

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Output the configuration for debugging purposes
logger.log("meanjs-template config: %j", config);

// Bootstrap db connection
var mongoUrl = config.mongo.protocol + config.mongo.host + ":" +
    config.mongo.port + "/" + config.mongo.database;

var db = mongoose.connect(mongoUrl, function(error) {
    if (error) {
        var verror = new VError(error, "Could not connect to MongoDB");
        logger.error(verror.message);
        throw verror;
    } else {
        logger.log("Connected to MongoDB");
        mongoose.connection.on("disconnected", function() {
            var errorMsg = "Lost connection to MongoDB";
            logger.error(errorMsg);
            throw new Error(errorMsg);
        });
    }
});

// load all the mongoose models
config.getGlobbedFiles("./app/models/**/*.js").forEach(function(modelPath) {
    require(path.resolve(modelPath));
});

// Init the express application
var app = require("./config/express")(db);

// Bootstrap passport config
require("./config/passport")();

// Start the app by listening on <port>
app.listen(config.port, function() {
    logger.log("Express server listening on HTTP on port " + config.port);
});

// Expose app
module.exports = app;
