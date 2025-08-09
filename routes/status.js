var express = require("express");
const databaseConnector = require("../databaseConnector");
var router = express.Router();

router.get("/", function (req, res, next) {
    res.send({
        success: true,
        databaseConnected: databaseConnector.isConnected,
    });
});

module.exports = router;
