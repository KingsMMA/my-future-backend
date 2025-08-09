var express = require("express");
var router = express.Router();
var authenticateJWT = require("../util/authenticateJWT");

router.get("/", authenticateJWT, function (req, res, next) {
    res.send("respond with a resource");
});

module.exports = router;
