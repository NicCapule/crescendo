const express = require("express");
const router = express.Router();

const sessionController = require("../controllers/sessionController");

router.get("/all", sessionController.getAllSessions);
router.get("/upcoming", sessionController.getUpcomingSessions);
router.get("/schedules", sessionController.getSchedulesForValidation);
router.get("/program", sessionController.getProgramDetailsBySessionId);
router.patch("/reschedule", sessionController.rescheduleSession);
module.exports = router;
