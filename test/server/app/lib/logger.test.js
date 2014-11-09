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

    it("should return test decorator in test environment", function() {
        var _getDecorator;

        _getDecorator = logger.__get__("_getDecorator");

        // normal test
        expect(_getDecorator()).toEqual("meanjs-template:test_environment");
    });

    describe("_getDecorator non-test node env", function() {
        var ENV, _getDecorator;

        beforeEach(function() {
            ENV = process.env.NODE_ENV;
            process.env.NODE_ENV = "notTest";

            _getDecorator = logger.__get__("_getDecorator");
        });

        it("should return the correct decorator for our test", function() {
            // "real" test (which if it fails, will cause stack trace issues)
            expect(_getDecorator()).toEqual("meanjs-template:logger.test");
        });

        afterEach(function() {
            process.env.NODE_ENV = ENV;
        });

    });

    it("should return a log and error function for logger", function() {
        var myLogger;

        myLogger = logger.__get__("logger")();

        expect(myLogger.log).toBeDefined();
        expect(myLogger.error).toBeDefined();
    });
});
