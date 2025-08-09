var express = require("express");
var jwt = require("jsonwebtoken");
const databaseConnector = require("../../util/databaseConnector");
var router = express.Router();

const SECRET = process.env.JWT_SECRET;

router.post("/", async function (req, res) {
    const {email, password} = req.body;

    const user = await databaseConnector.authenticate(email, password);
    if (user) {
        const token = jwt.sign(user, SECRET, {expiresIn: "30d"});
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days
        });
        res.json({success: true});
    } else {
        res.status(401).json({success: false, message: "Invalid credentials"});
    }
});

module.exports = router;
