var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();

const SECRET = process.env.JWT_SECRET;

router.post("/", function (req, res) {
    const { username, password } = req.body;
    if (username === "admin" && password === "password") {
        const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days
        });
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

module.exports = router;
