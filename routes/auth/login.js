var express = require("express");
var jwt = require("jsonwebtoken");
const databaseConnector = require("../../util/databaseConnector");
const { logIn } = require("../../util/authenticateJWT");
var router = express.Router();

const SECRET = process.env.JWT_SECRET;

router.post("/", async function (req, res) {
    if (req.cookies.token) {
        res.status(400).json({
            success: false,
            message:
                "Already logged in: please use /auth/logout to log out first",
        });
        return;
    }

    const { email, password } = req.body;

    const user = await databaseConnector.authenticate(email, password);
    if (user) {
        logIn(res, user);
        res.json({ success: true });
    } else {
        res.status(401).json({
            success: false,
            message: "Invalid credentials",
        });
    }
});

module.exports = router;
