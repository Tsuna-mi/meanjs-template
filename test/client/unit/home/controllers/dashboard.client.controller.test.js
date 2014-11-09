"use strict";

describe("DashboardCtrl", function() {
    var $scope, controller;

    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function($rootScope, $controller) {
        $scope = $rootScope.$new();

        controller = $controller("DashboardCtrl", {
            $scope: $scope
        });

    }));

    it("should exist", function() {
        expect(controller).toBeDefined();
    });

});
