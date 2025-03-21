const express = require("express");
const router = express.Router();

const sessionController = require("../controllers/sessionController");

router.get("/all", sessionController.getScheduledSessions);
router.get("/upcoming", sessionController.getUpcomingSessions);
router.get("/schedules", sessionController.getSchedulesForValidation);
router.get("/program", sessionController.getProgramDetailsBySessionId);
router.post("/reschedule", sessionController.rescheduleSession);
router.patch("/:id/attendance", sessionController.markAttendance);
router.delete("/forfeit/:id", sessionController.forfeitSession);
module.exports = router;
