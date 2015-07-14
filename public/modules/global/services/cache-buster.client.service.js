"use strict";

angular.module("global").factory("CacheBusterService", ["$cacheFactory",
    function($cacheFactory) {
        var cacheBuster;

        cacheBuster = {};

        // define a general method for busting the angular cache, given a URL
        cacheBuster.bustCache = function bustCache(url) {
            var $httpDefaultCache;

            $httpDefaultCache = $cacheFactory.get("$http");
            $httpDefaultCache.remove(url);
        };

        return cacheBuster;
    }
]);
