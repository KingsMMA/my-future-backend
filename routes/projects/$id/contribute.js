var express = require("express");
const { authLoggedIn } = require("../../../util/authenticateJWT");
const databaseConnector = require("../../../util/databaseConnector");
var router = express.Router();

router.post("/", authLoggedIn, async function (req, res, next) {
    const urlSegments = req.baseUrl.split("/");
    const projectId = urlSegments[urlSegments.length - 2];

    const amount = req.body.amount;
    if (!amount || typeof amount !== "number" || amount <= 0) {
        return res.status(400).send({
            success: false,
            message: "Invalid contribution amount",
        });
    }

    const authedUser = await databaseConnector.getUserByUuid(req.user.uuid);
    if (!authedUser) {
        return res.status(404).send({
            success: false,
            message: "User not found",
        });
    }

    if (authedUser.points < amount) {
        return res.status(400).send({
            success: false,
            message: `Insufficient points to contribute (${authedUser.points.toLocaleString()} points available, attempted to contribute ${amount.toLocaleString()})`,
        });
    }

    const project = await databaseConnector.getProjectById(projectId);
    if (!project) {
        return res.status(404).send({
            success: false,
            message: "Project not found",
        });
    }

    if (project.progress >= project.goal) {
        return res.status(400).send({
            success: false,
            message: "Project has already reached its goal",
        });
    }

    const success = await databaseConnector.contributeToProject(projectId, authedUser.uuid, amount, project.progress + amount >= project.goal);
    if (!success) {
        return res.status(500).send({
            success: false,
            message: "Failed to process contribution",
        });
    }

    res.send({
        success: true,
        message: `Successfully contributed ${amount.toLocaleString()} points to project ${project.name}.`,
        amount,
        newProgress: project.progress + amount,
        newPoints: authedUser.points - amount,
        goal: project.goal,
        completed: project.progress + amount >= project.goal,
    });
});

module.exports = router;
