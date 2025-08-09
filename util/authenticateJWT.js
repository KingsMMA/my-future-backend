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

const authFactory = requiredRole => {
    return function(req, res, next) {
        authLoggedIn(req, res, () => {
            if (req.user.accountType !== requiredRole) {
                return res.status(403).json({ success: false, message: "You don't have the necessary permissions to access this endpoint" })
            }

            next();
        });
    }
}

const authCitizenOnly = authFactory("citizen");
const authBusinessOnly = authFactory("business");
const authGovernmentOnly = authFactory("government");

module.exports = { authLoggedIn, authCitizenOnly, authBusinessOnly, authGovernmentOnly };

