const express = require("express");
const router = express.Router();

const enrollmentController = require("../controllers/enrollmentController");

// Enrollment Routes
router.post("/new-student", enrollmentController.enrollNewStudent);
router.post("/existing-student", enrollmentController.enrollExistingStudent);

module.exports = router;
