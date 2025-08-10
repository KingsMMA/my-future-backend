var express = require("express");
const {authGovernmentOnly} = require("../../util/authenticateJWT");
const databaseConnector = require("../../util/databaseConnector");
var router = express.Router();

router.get("/", authGovernmentOnly, async function (req, res, next) {
    res.send({
        success: true,
        users: await databaseConnector.listUsers(),
    });
});

module.exports = router;
