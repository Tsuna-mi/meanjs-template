"use strict";

var init = require("./config/init")(),
    config = require("./config/config"),
    mongoose = require("mongoose");

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var mongoUrl = config.mongo.protocol + config.mongo.host + ":" +
    config.mongo.port + "/" + config.mongo.database;
var db = mongoose.connect(mongoUrl, function(err) {
    if (err) {
        console.error("\x1b[31m", "Could not connect to MongoDB!");
        console.log(err);
    }
});

// Init the express application
var app = require("./config/express")(db);

// Bootstrap passport config
require("./config/passport")();

// Start the app by listening on <port>
var server = app.listen(config.port, function() {
    console.log("Express server listening on HTTP on port " + config.port);
});

// Expose app
exports = module.exports = app;
