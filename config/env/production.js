"use strict";

var gitRev = require("git-rev-sync");

var version = gitRev.short();

module.exports = {
    assets: {
        lib: {
            css: [
                "public/dist/vendor-" + version + ".min.css"
            ],
            js: [
                "public/dist/vendor-" + version + ".min.js"
            ]
        },
        css: [
            "public/dist/application-" + version + ".min.css"
        ],
        js: [
            "public/dist/application-" + version + ".min.js",
            "public/dist/templates-" + version + ".min.js"
        ]
    }
};
