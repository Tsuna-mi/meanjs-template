"use strict";

var debug = require("debug");

// enable the "meanjs-template" namespace by default
debug.enable("meanjs-template*");

// returns the calling filename, but prepended with "meanjs-template:"
function _getDecorator() {
    // the code below screws up test output when a test fails,
    // so in the test environment, set this to return a constant
    // string rather than determining the decorator via stack trace.
    if (process.env.NODE_ENV === "test") {
        return "meanjs-template:test_environment";
    }

    try {
        var err = new Error();
        var callerfile;
        var currentfile;

        Error.prepareStackTrace = function(err, stack) {
            return stack;
        };

        currentfile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();

            if (currentfile !== callerfile) {
                // trim the file to the file name itself (minus the .js)
                callerfile = callerfile.slice(callerfile.lastIndexOf("/") + 1, callerfile.indexOf(".js"));
                // prepend the project name
                return "meanjs-template:" + callerfile;
            }
        }
    } catch (err) {}
    return undefined;
}

function logger() {
    var decorator, log, error;

    // get the filename which is used to decorate the debug module
    decorator = _getDecorator();

    // setup two debug'ers, one for console.log and one for console.error
    log = debug(decorator);
    error = debug(decorator);
    error.log = console.error.bind(console);

    // return the two under the log and error functions
    return {
        log: log,
        error: error
    };
}
module.exports = logger;
