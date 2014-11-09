"use strict";

describe("AppCtrl", function() {
    var $scope, controller;

    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function($rootScope, $controller) {
        // create a new $scope for each test
        $scope = $rootScope.$new();

        // use the new $scope in creating the controller
        controller = $controller("AppCtrl", {
            $scope: $scope
        });

    }));

    it("should exist", function() {
        expect(controller).toBeDefined();
    });

});
