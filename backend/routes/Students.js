const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");

// Student Routes
router.get("/table", studentController.getStudentTable);
router.get("/info/:id", studentController.getStudentInfo);
router.get("/sessions/:id", studentController.getStudentSessions);
router.get("/count", studentController.getStudentCount);
router.post("/", studentController.createStudent);
router.delete("/:id", studentController.deleteStudent);

module.exports = router;
