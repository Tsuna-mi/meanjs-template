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
        lesslint: {
            options: {
                csslint: {
                    csslintrc: ".csslintrc"
                }
            },
            src: "public/modules/**/*.less"
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
            }
        },
        jasmine_node: {
            options: {
                forceExit: true,
                matchall: true,
                showColors: true,
                includeStackTrace: true
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
                reporters: "dots",
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
        less: {
            options: {
                paths: ["public/modules"]
            },
            files: {
                expand: true,
                cwd: "public/modules",
                src: ["**/*.less"],
                dest: "public/dist/modules/",
                ext: ".css"
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

    grunt.registerTask("default", ["lint", "generate-css", "concurrent:dev"]);
    grunt.registerTask("watch-tasks", ["lint", "generate-css"]);

    grunt.registerTask("lint", ["jshint", "lesslint"]);

    grunt.registerTask("generate-css", ["less", "postcss"]);

    grunt.registerTask("test", ["lint", "generate-css", "env:test", "jasmine_node", "karma:singleRun", "server", "protractor"]);

    grunt.registerTask("build", ["lint", "generate-css", "loadConfig", "ngtemplates", "uglify", "cssmin", "concat"]);

    grunt.registerTask("ci", ["lint", "generate-css", "env:test", "jasmine_node", "karma:continuous", "protractor:continuous"]);
};
