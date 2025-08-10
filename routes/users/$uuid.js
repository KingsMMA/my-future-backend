var express = require("express");
const { authGovernmentOnly } = require("../../util/authenticateJWT");
const databaseConnector = require("../../util/databaseConnector");
var router = express.Router();

router.get("/", authGovernmentOnly, async function (req, res, next) {
    const uuid = req.baseUrl.split("/").pop();  // req.params is always empty, so extract the UUID from the URL directly
    const user = await databaseConnector.getUserByUuid(uuid);
    if (!user) {
        return res.status(404).send({
            success: false,
            message: "User not found",
        });
    }

    res.send({
        success: true,
        user: user,
    });
});

module.exports = router;
