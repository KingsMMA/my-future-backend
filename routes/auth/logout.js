var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {
    if (!req.cookies.token) {
        return res.status(400).json({
            success: false,
            message: "Not logged in: please use /auth/login to log in first.",
        });
    }

    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
    });

    res.send({
        success: true,
    });
});

module.exports = router;
