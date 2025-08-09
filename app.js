var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var fs = require("fs");
const { getDb } = require("./util/databaseConnector");

var app = express();

require('dotenv').config();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

function loadRoutes(dir, baseRoute = "") {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            loadRoutes(fullPath, `${baseRoute}/${entry.name}`);
        } else if (entry.isFile() && entry.name.endsWith(".js")) {
            let route = baseRoute;
            if (entry.name !== "index.js")
                route += "/" + entry.name.replace(".js", "");

            const router = require(fullPath);
            app.use(route?.replaceAll("$", ":") || "/", router);
            console.log(`Loaded route: ${route || "/"}`);
        }
    });
}

loadRoutes(path.join(__dirname, "routes"));

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json(Object.assign(
        { success: false },
        err
    ));
});

void getDb;

module.exports = app;
