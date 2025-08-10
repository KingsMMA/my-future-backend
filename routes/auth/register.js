var express = require("express");
const validatePfp = require("../../util/imageUtil").default;
const databaseConnector = require("../../util/databaseConnector");
const {logIn} = require("../../util/authenticateJWT");
var router = express.Router();

router.post("/", async function (req, res, next) {
    if (req.cookies.token) {
        res.status(400).json({success: false, message: "Already logged in: please use /auth/logout to log out first"});
        return;
    }

    const requiredFields = {
        email: "string",
        name: "string",
        accountType: "string",
        password: "string",
        address: "string",
        pfp: "string"
    };
    const allowedAccountTypes = ["citizen", "business"];
    const body = req.body;

    // Check for extra or missing fields
    const bodyKeys = Object.keys(body);
    if (
        bodyKeys.length !== Object.keys(requiredFields).length ||
        !Object.keys(requiredFields).every((field) => bodyKeys.includes(field))
    ) {
        return res.status(400).json({ success: false, message: "Invalid request body structure" });
    }

    // Type and value checks
    if (
        Object.entries(requiredFields).some(([field, type]) => typeof body[field] !== type) ||
        !allowedAccountTypes.includes(body.accountType)
    ) {
        return res.status(400).json({ success: false, message: "Invalid body values" });
    }

    // Email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        return res.status(400).json({ success: false, message: "Invalid email" });
    }

    // PFP format check
    if (!(await validatePfp(body.pfp))) {
        return res.status(400).json({ success: false, message: `Profile picture must be an image with a max size of ${process.env.MAX_PFP_SIZE}x${process.env.MAX_PFP_SIZE}` });
    }

    const authUser = await databaseConnector.createUser(body);
    if (authUser) {
        logIn(res, authUser);
        res.json({ success: true });
    } else {
        res.status(409).json({ success: false, message: "An account has already been registered with this email" });
    }
});

module.exports = router;
