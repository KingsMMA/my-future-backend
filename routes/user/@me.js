var express = require("express");
const { authLoggedIn } = require("../../util/authenticateJWT");
const databaseConnector = require("../../util/databaseConnector");
var router = express.Router();

router.get("/", authLoggedIn, async function (req, res, next) {
    res.send({
        success: true,
        user: await databaseConnector.getUserByUuid(req.user.uuid),
    });
});

module.exports = router;
