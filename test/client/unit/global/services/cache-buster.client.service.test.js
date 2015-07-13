"use strict";

describe("CacheBusterService", function() {
    var cacheBusterService, $cacheFactory;

    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function(CacheBusterService, _$cacheFactory_) {
        cacheBusterService = CacheBusterService;
        $cacheFactory = _$cacheFactory_;

        // if $http is not yet available in $cacheFactory, add it to avoid test problems
        if (!$cacheFactory.get("$http")) {
            $cacheFactory("$http");
        }
    }));

    it("should exist", function() {
        expect(cacheBusterService).toBeDefined();
    });

    describe("busting cache", function() {
        var testUrl;

        beforeEach(function() {
            testUrl = "/api/secure/test";

            $cacheFactory.get("$http").put(testUrl, true);
        });

        it("should bust the cache", function() {
            expect($cacheFactory.get("$http").get(testUrl)).toBeTruthy();

            cacheBusterService.bustCache(testUrl);

            expect($cacheFactory.get("$http").get(testUrl)).toBeFalsy();
        });
    });
});
