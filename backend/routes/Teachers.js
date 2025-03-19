const express = require("express");
const router = express.Router();

const teacherController = require("../controllers/teacherController");
const { authorizeRole } = require("../middlewares/authMiddleware");

// Teacher Routes
router.get(
  "/table",
  authorizeRole(["Admin", "Teacher"]),
  teacherController.getTeacherTable
);
//-----------------------------------//
router.get(
  "/info/:id",
  authorizeRole(["Admin", "Teacher"]),
  teacherController.getTeacherInfo
);
//-----------------------------------//
router.get(
  "/profile/:id",
  authorizeRole(["Teacher"]),
  teacherController.getTeacherProfile
);
//-----------------------------------//
router.get(
  "/sessions/:id",
  authorizeRole(["Admin", "Teacher"]),
  teacherController.getTeacherSessions
);
//-----------------------------------//
router.get(
  "/count",
  authorizeRole(["Admin", "Teacher"]),
  teacherController.getTeacherCount
);
//-----------------------------------//
router.get(
  "/salary",
  authorizeRole(["Admin", "Teacher"]),
  teacherController.getTeacherCount
);
//-----------------------------------//
router.put(
  "/:id/update/instruments",
  authorizeRole(["Admin", "Teacher"]),
  teacherController.updateInstruments
);
//-----------------------------------//
router.patch(
  "/:id/update/phone",
  authorizeRole(["Admin", "Teacher"]),
  teacherController.updatePhone
);
//-----------------------------------//
router.put(
  "/:id/update/availability",
  authorizeRole(["Admin", "Teacher"]),
  teacherController.updateAvailability
);
//-----------------------------------//
router.post("/", authorizeRole(["Admin"]), teacherController.createTeacher);
//----------------------------------------------------------------------------------------//

module.exports = router;
