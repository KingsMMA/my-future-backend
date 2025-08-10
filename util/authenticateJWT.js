const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

function logIn(res, authUser) {
    const token = jwt.sign(authUser, SECRET, { expiresIn: "30d" });
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return token;
}

function authLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Authentication required" });
    }
    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res
                .status(403)
                .json({ success: false, message: "Invalid token" });
        }
        req.user = user;
        next();
    });
}

const authFactory = (requiredRole) => {
    return function (req, res, next) {
        authLoggedIn(req, res, () => {
            if (req.user.accountType !== requiredRole) {
                return res
                    .status(403)
                    .json({
                        success: false,
                        message:
                            "You don't have the necessary permissions to access this endpoint",
                    });
            }

            next();
        });
    };
};

const authCitizenOnly = authFactory("citizen");
const authGovernmentOnly = authFactory("government");

module.exports = { logIn, authLoggedIn, authCitizenOnly, authGovernmentOnly };
