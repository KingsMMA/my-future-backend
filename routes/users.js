var express = require("express");
var router = express.Router();
var { authLoggedIn } = require("../util/authenticateJWT");

router.get("/", authLoggedIn, function (req, res, next) {
    res.send("respond with a resource");
});

module.exports = router;
