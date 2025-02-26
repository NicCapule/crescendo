const express = require("express");
const router = express.Router();

const {
  Sequelize,
  Student,
  Enrollment,
  Program,
  Instrument,
  Teacher,
  Session,
} = require("../models");

router.get("/table", async (req, res) => {
  const StudentTable = await Student.findAll({
    attributes: [
      "student_id",
      "student_first_name",
      "student_last_name",
      "student_age",
      "student_address",
      "student_email",
      "student_phone",
      [
        Sequelize.fn("COUNT", Sequelize.col("Enrollments.enrollment_id")),
        "total_programs",
      ],
    ],
    include: [
      {
        model: Enrollment,
        attributes: [], // We only need the count, so don't fetch extra columns
      },
    ],
    group: ["Student.student_id"],
  });
  res.json(StudentTable);
});
//----------------------------------------------------------------------------------------//
router.get("/info/:id", async (req, res) => {
  const { id } = req.params;
  const StudentDetails = await Student.findByPk(id, {
    include: [
      {
        model: Enrollment,
        include: [
          {
            model: Program,
            include: [
              { model: Instrument, attributes: ["instrument_name"] },
              {
                model: Teacher,
                attributes: ["teacher_first_name", "teacher_last_name"],
              },
            ],
          },
        ],
      },
    ],
  });
  res.json(StudentDetails);
});
//----------------------------------------------------------------------------------------//
router.get("/sessions/:id", async (req, res) => {
  const { id } = req.params;
  const StudentSessions = await Session.findAll({
    where: { student_id: id }, // Fetch sessions where student_id matches
    include: [
      {
        model: Student,
        attributes: ["student_first_name", "student_last_name"],
      },
      {
        model: Program,
        include: [
          {
            model: Instrument,
            attributes: ["instrument_name"],
          },
          {
            model: Teacher,
            attributes: ["teacher_first_name", "teacher_last_name"],
          },
        ],
      },
    ],
  });
  res.json(StudentSessions);
});
//----------------------------------------------------------------------------------------//
router.get("/count", async (req, res) => {
  const studentCount = await Student.count();
  res.json(studentCount);
});
//----------------------------------------------------------------------------------------//
router.post("/", async (req, res) => {
  const student = req.body;
  await Student.create(student);
  res.json(student);
});

module.exports = router;
