var express = require("express");
const { authGovernmentOnly } = require("../../../util/authenticateJWT");
const databaseConnector = require("../../../util/databaseConnector");
var router = express.Router();

router.post("/", authGovernmentOnly, function (req, res, next) {
    const projectId = req.baseUrl.split("/").slice(-2, -1)[0]; // Extract project id from URL

    const contribData = req.body;
    if (!contribData || typeof contribData !== "object") {
        return res
            .status(400)
            .json({ success: false, message: "Invalid request body" });
    }

    const requiredFields = {
        donor: "string",
        equipment: "string",
        estimatedValue: "number",
    };

    // Check for extra or missing fields
    const bodyKeys = Object.keys(contribData);
    if (
        bodyKeys.length !== Object.keys(requiredFields).length ||
        !Object.keys(requiredFields).every((field) => bodyKeys.includes(field))
    ) {
        return res
            .status(400)
            .json({
                success: false,
                message: "Invalid request body structure",
            });
    }

    // Type and value checks
    if (
        Object.entries(requiredFields).some(
            ([field, type]) => typeof contribData[field] !== type,
        )
    ) {
        return res
            .status(400)
            .json({ success: false, message: "Invalid body values" });
    }

    const project = databaseConnector.getProjectById(projectId);
    if (!project) {
        return res
            .status(404)
            .json({ success: false, message: "Project not found" });
    }

    const success = databaseConnector.addBusinessContribution(
        projectId,
        contribData,
    );
    if (!success) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Failed to add business contribution",
            });
    }

    res.json({
        success: true,
        message: `Successfully added business contribution to project ${project.name}.`,
        contribution: contribData,
    });
});

module.exports = router;
