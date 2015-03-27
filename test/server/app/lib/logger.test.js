"use strict";

var rewire = require("rewire");

describe("The logger library", function() {
    var logger;

    beforeEach(function() {
        logger = rewire("../../../../app/lib/logger");
    });

    it("should exist", function() {
        expect(logger).toBeDefined();
    });

    it("should return a log and error function for logger", function() {
        var myLogger;

        myLogger = logger();

        expect(myLogger.log).toBeDefined();
        expect(myLogger.error).toBeDefined();
    });
});
