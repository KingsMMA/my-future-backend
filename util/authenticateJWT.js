const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

function authLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Authentication required" });
    }
    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Invalid token" });
        }
        req.user = user;
        next();
    });
}

module.exports = authLoggedIn;

