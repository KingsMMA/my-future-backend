var express = require("express");
const { authLoggedIn } = require("../../util/authenticateJWT");
var router = express.Router();

router.get("/", authLoggedIn, function (req, res, next) {
    res.send({
        success: true,
        user: req.user,
    });
});

module.exports = router;
