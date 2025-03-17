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
router.get(
  "/info/:id",
  authorizeRole(["Admin", "Teacher"]),
  teacherController.getTeacherInfo
);
router.get(
  "/sessions/:id",
  authorizeRole(["Admin", "Teacher"]),
  teacherController.getTeacherSessions
);
router.get(
  "/count",
  authorizeRole(["Admin", "Teacher"]),
  teacherController.getTeacherCount
);

router.get(
  "/salary",
  authorizeRole(["Admin", "Teacher"]),
  teacherController.getTeacherCount
);
router.post("/", authorizeRole(["Admin"]), teacherController.createTeacher);
//----------------------------------------------------------------------------------------//

module.exports = router;
