const express = require("express");
const router = express.Router();

const sessionController = require("../controllers/sessionController");

router.get("/all", sessionController.getAllSessions);
router.get("/upcoming", sessionController.getUpcomingSessions);

module.exports = router;
