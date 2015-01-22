"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        watch: {
            files: ["**/*", "!**/node_modules/**", "!**public/lib/**", "!**public/dist/**"],
            tasks: ["watch-tasks"],
        },
        jshint: {
            files: [
                "**/*.js"
            ],
            options: {
                ignores: [
                    "node_modules/**",
                    "public/dist/**",
                    "public/lib/**"
                ],
                jshintrc: true
            }
        },
        scsslint: {
            allFiles: [
                "public/modules/**/*.scss",
            ],
            options: {
                config: ".scss-lint.yml"
            }
        },
        uglify: {
            production: {
                options: {
                    mangle: true,
                    compress: false,
                    sourceMap: true
                },
                files: {
                    "public/dist/application.min.js": "<%= applicationJavaScriptFiles %>",
                    "public/dist/templates.min.js": "public/dist/templates.js"
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    "public/dist/application.min.css": "<%= applicationCSSFiles %>",
                    "public/dist/vendor.min.css": "<%= vendorCSSFiles %>"
                }
            }
        },
        concat: {
            production: {
                options: {
                    stripBanners: true
                },
                files: {
                    "public/dist/vendor.min.js": "<%= vendorJavaScriptFiles %>"
                }
            }
        },
        env: {
            test: {
                NODE_ENV: "test"
            },
            build: {
                NODE_ENV: "build"
            }
        },
        jasmine_node: {
            options: {
                forceExit: true,
                matchall: true,
                showColors: true,
                includeStackTrace: true,
                jUnit: {
                    // only enable JUnit reports if in continuous integration mode
                    report: process.env.CI,
                    savePath: "test-reports",
                    useDotNotation: true,
                    consolidate: true
                }
            },
            all: ["test/server"]
        },
        karma: {
            unit: {
                configFile: "karma.conf.js",
                background: true
            },
            singleRun: {
                configFile: "karma.conf.js",
                singleRun: true
            },
            continuous: {
                configFile: "karma.conf.js",
                singleRun: true,
                reporters: ["dots", "junit"],
                browsers: ["Firefox"]
            }
        },
        protractor: {
            options: {
                configFile: "protractor-conf.js",
                keepAlive: true
            },
            continuous: {
                options: {
                    configFile: "protractor-conf.js",
                    keepAlive: false
                }
            }
        },
        concurrent: {
            dev: {
                tasks: ["nodemon", "watch"]
            },
            options: {
                logConcurrentOutput: true
            }
        },
        nodemon: {
            dev: {
                script: "server.js",
                options: {
                    ignore: ["node_modules/**", "public/lib/**", "public/dist/**"]
                }
            }
        },
        ngtemplates: {
            options: {
                htmlmin: {
                    collapseWhitespace: true,
                    removeComments: true
                },
                url: function(url) {
                    return url.replace("public", "assets");
                },
                prefix: "/"
            },
            "meanjs-template": {
                src: "public/modules/**/**.html",
                dest: "public/dist/templates.js"
            }
        },
        sass: {
            files: {
                expand: true,
                cwd: "public/modules",
                src: ["**/*.scss"],
                dest: "public/dist/modules/",
                ext: ".css"
            }
        },
        postcss: {
            options: {
                processors: [
                    require("autoprefixer-core")({
                        browsers: "last 5 versions"
                    }).postcss
                ]
            },
            dist: {
                src: "public/dist/modules/**/*.css"
            }
        }
    });

    // Load NPM tasks 
    require("load-grunt-tasks")(grunt);

    // A Task for loading the configuration object
    grunt.task.registerTask("loadConfig", "Task that loads the config into a grunt option.", function() {
        var init = require("./config/init")();
        var config = require("./config/config");

        grunt.config.set("vendorJavaScriptFiles", config.assets.lib.js);
        grunt.config.set("vendorCSSFiles", config.assets.lib.css);
        grunt.config.set("applicationJavaScriptFiles", config.assets.js);
        grunt.config.set("applicationCSSFiles", config.assets.css);
    });

    grunt.registerTask("server", "Start the server", function() {
        require("./server.js");
    });

    grunt.registerTask("watch-tasks", ["lint", "generate-css"]);
    grunt.registerTask("lint", ["jshint", "scsslint"]);
    grunt.registerTask("generate-css", ["sass", "postcss"]);

    grunt.registerTask("default", ["lint", "generate-css", "concurrent:dev"]);
    grunt.registerTask("test", ["env:test", "lint", "generate-css", "jasmine_node", "karma:singleRun", "server", "protractor"]);
    grunt.registerTask("build", ["env:build", "loadConfig", "lint", "generate-css", "ngtemplates", "uglify", "cssmin", "concat"]);
    grunt.registerTask("ci", ["env:test", "lint", "generate-css", "jasmine_node", "karma:continuous", "server", "protractor:continuous"]);
};
