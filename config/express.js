"use strict";

var express = require("express"),
    morgan = require("morgan"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    session = require("cookie-session"),
    compress = require("compression"),
    helmet = require("helmet"),
    passport = require("passport"),
    config = require("./config"),
    consolidate = require("consolidate"),
    path = require("path"),
    gitRev = require("git-rev-sync"),
    logger = require("../app/lib/logger")();

module.exports = function(db) {
    var app, domainMiddleware, uuid;

    // Initialize express app
    app = express();

    // Setting application local variables
    app.locals.jsFiles = config.getJavaScriptAssets();
    app.locals.cssFiles = config.getCSSAssets();
    app.locals.gitRevision = gitRev.long();

    // generate a unique ID for each request within the domain
    domainMiddleware = require("express-domain-middleware");
    uuid = require("uuid");
    domainMiddleware.id = function() {
        return uuid.v4();
    };
    app.use(domainMiddleware);

    app.use(function(req, res, next) {
        // don't log asset requests (to keep the logs less chatty)
        if (req.path && req.path.indexOf("/assets") === 0) {
            return next();
        }

        logger.log("ROUTE: req.path: %s, req.params: %j, req.query: %j",
            req.path, req.params, req.query);
        return next();
    });

    // Passing the request url to environment locals
    app.use(function(req, res, next) {
        res.locals.url = req.protocol + "://" + req.headers.host + req.url;
        next();
    });

    // Should be placed before express.static
    app.use(compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader("Content-Type"));
        }
    }));

    // Set the template engine
    app.engine("server.view.html", consolidate[config.templateEngine]);

    // Set views path and view engine
    app.set("view engine", "server.view.html");
    app.set("views", "./app/views");

    // Environment dependent middleware
    if (app.get("env") === "development") {
        logger.log("in development environment");

        // Enable logger (morgan)
        app.use(morgan("dev"));

        // Disable views cache
        app.set("view cache", false);
    } else if (app.get("env") === "production") {
        logger.log("in production environment");

        app.locals.cache = "memory";

        // Use helmet to secure Express headers
        // (restrict this to the production environment since
        // it causes some problems with development tools)
        app.use(helmet.xframe());
        app.use(helmet.xssFilter());
        app.use(helmet.nosniff());
        app.use(helmet.ienoopen());
        app.disable("x-powered-by");
    }

    // use the cookie parser to access the cookies easier
    app.use(cookieParser());

    // use express' body parser to access body elements later
    app.use(bodyParser.json());

    // use express' session
    app.use(session({
        name: "meanjs-template",
        secret: config.sessionSecret
    }));

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    // load all configured routes (this includes API and UI routes)
    config.getGlobbedFiles("./app/routes/**/*.js").forEach(function(routePath) {
        require(path.resolve(routePath))(app);
    });

    // serve all static assets in the public directory under /assets
    app.use("/assets", express.static(path.resolve("./public")));

    // if at this point we don't have a route match for /api, return 404
    app.all("/api/*", function(req, res) {
        res.status(404).send({
            error: "route not found: " + req.url
        });
    });

    // THIS MUST BE THE LAST ROUTE
    // configure all remaining routes to hit the UI
    // This was done so that the root URL hits the UI app, and that UI app
    // handles all URLs under that. Know that at this point we have "reserved"
    // /assets/* and /api/*, for static assets and APIs, respectively. If
    // either of those two URLs are used by the UI, they won't resolve correctly.
    app.all("/*", function(req, res) {
        res.render("index");
    });

    return app;
};
