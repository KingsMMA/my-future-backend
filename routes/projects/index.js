var express = require("express");
const databaseConnector = require("../../util/databaseConnector");
var router = express.Router();

router.get("/", async function (req, res, next) {
    res.send({
        success: true,
        projects: await databaseConnector.listProjects(),
    });
});

module.exports = router;
