require('dotenv').config();

var createError = require("http-errors");
var express = require("express");
const cors = require('cors');
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var fs = require("fs");
const { getDb } = require("./util/databaseConnector");

var app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json({ limit: "50mb" }));
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
            const finalRoute = route?.replaceAll("$", ":").replaceAll("!", "") || "/";
            app.use(finalRoute, router);
            console.log(`Loaded route: ${finalRoute}`);
        }
    });
}

loadRoutes(path.join(__dirname, "routes"));

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.error(err);
    res.json(Object.assign(
        { success: false },
        err
    ));
});

void getDb;

module.exports = app;
