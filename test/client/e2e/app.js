"use strict";

describe("The application", function() {
    var ROOT_URL_PREFIX;

    // TODO should we keep these in a configuration file?
    ROOT_URL_PREFIX = "/";

    beforeEach(function() {
        // get the root of the project
        browser.get(ROOT_URL_PREFIX);
    });

    it("should display heading", function(done) {
        browser.getTitle().then(function(title) {
            expect(title).toEqual("meanjs-template");
            done();
        });
    });

});
