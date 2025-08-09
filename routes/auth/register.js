var express = require("express");
const validatePfp = require("../../util/imageUtil");
const databaseConnector = require("../../util/databaseConnector");
const {logIn} = require("../../util/authenticateJWT");
var router = express.Router();

router.post("/", function (req, res, next) {
    if (req.cookies.token) {
        res.status(400).json({success: false, message: "Already logged in: please use /auth/logout to log out first"});
        return;
    }

    const requiredFields = [
        "email",
        "phoneNumber",
        "name",
        "accountType",
        "password",
        "birthdate",
        "address",
        "pfp"
    ];
    const allowedAccountTypes = ["citizen", "business"];
    const body = req.body;

    // Check for extra or missing fields
    const bodyKeys = Object.keys(body);
    if (
        bodyKeys.length !== requiredFields.length ||
        !requiredFields.every((field) => bodyKeys.includes(field))
    ) {
        return res.status(400).json({ success: false, message: "Invalid fields in request body" });
    }

    // Type and value checks
    if (
        typeof body.email !== "string" ||
        typeof body.phoneNumber !== "string" ||
        typeof body.name !== "string" ||
        typeof body.password !== "string" ||
        typeof body.birthdate !== "string" ||
        typeof body.address !== "string" ||
        typeof body.pfp !== "string" ||
        !allowedAccountTypes.includes(body.accountType)
    ) {
        return res.status(400).json({ success: false, message: "Invalid field types or values" });
    }

    // Email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Birthdate format check (YYYY-mm-dd)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(body.birthdate)) {
        return res.status(400).json({ success: false, message: "Invalid birthdate format" });
    }

    // PFP format check
    if (!validatePfp(body.pfp)) {
        return res.status(400).json({ success: false, message: `Profile picture must be an image with a max size of ${process.env.MAX_PFP_SIZE}x${process.env.MAX_PFP_SIZE}` });
    }

    const authUser = databaseConnector.createUser(body);
    if (authUser) {
        logIn(res, authUser);
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, message: "An internal server error occurred" });
    }
});

module.exports = router;
