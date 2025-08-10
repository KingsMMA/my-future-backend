var express = require("express");
const databaseConnector = require("../../util/databaseConnector");
const {authGovernmentOnly} = require("../../util/authenticateJWT");
var router = express.Router();

router.get("/", async function (req, res, next) {
    const projectId = req.baseUrl.split("/").pop();  // Extract project id from URL
    const project = await databaseConnector.getProjectById(projectId);

    if (!project) {
        return res.status(404).send({
            success: false,
            message: "Project not found",
        });
    }

    res.send({
        success: true,
        project,
    });
});

router.post("/", authGovernmentOnly, async function (req, res, next) {
    const projectId = req.baseUrl.split("/").pop();  // Extract project id from URL
    const projectData = req.body;
    if (projectId !== projectData.id) {
        return res.status(400).json({ success: false, message: "Project ID in URL does not match ID in request body" });
    }

    const requiredFields = {
        id: "string",
        name: "string",
        description: "string",
        category: "string",
        thumbnail: "string",
        goal: "number",
        contact: "string"
    };
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
        Object.entries(requiredFields).some(([field, type]) => typeof body[field] !== type)
    ) {
        return res.status(400).json({ success: false, message: "Invalid body values" });
    }

    const result = await databaseConnector.createProject(projectData);
    if (result === null) {
        return res.status(500).json({ success: false, message: "Failed to create project" });
    } else if (!result) {
        return res.status(409).json({ success: false, message: "Project with this ID already exists" });
    }

    res.send({
        success: true,
    });
});

module.exports = router;
