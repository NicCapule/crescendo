const express = require("express");
const router = express.Router();

const {
  Sequelize,
  Teacher,
  User,
  Instrument,
  Program,
  Enrollment,
  Student,
  Session,
} = require("../models");
//----------------------------------------------------------------------------------------//
router.get("/table", async (req, res) => {
  const TeacherTable = await Teacher.findAll({
    attributes: [
      "teacher_id",
      "teacher_first_name",
      "teacher_last_name",
      "teacher_phone",
      [
        Sequelize.fn("COUNT", Sequelize.col("Programs.program_id")),
        "total_programs",
      ],
    ],
    include: [
      {
        model: Program,
        attributes: [],
      },
      {
        model: User,
        attributes: ["email"],
      },
      {
        model: Instrument,
        attributes: ["instrument_name"],
      },
    ],
    group: ["Teacher.teacher_id", "User.user_id", "Instruments.instrument_id"],
  });
  res.json(TeacherTable);
});
//----------------------------------------------------------------------------------------//
router.get("/info/:id", async (req, res) => {
  const { id } = req.params;
  const TeacherDetails = await Teacher.findByPk(id, {
    include: [
      {
        model: Program,
        include: [
          {
            model: Enrollment,
            attributes: ["enrollment_id"],
            include: [
              {
                model: Student,
                attributes: ["student_first_name", "student_last_name"],
              },
            ],
          },
          {
            model: Instrument,
            attributes: ["instrument_name"],
          },
        ],
      },
      {
        model: User,
        attributes: ["email"],
      },
      {
        model: Instrument,
        attributes: ["instrument_name"],
      },
    ],
  });
  res.json(TeacherDetails);
});
//----------------------------------------------------------------------------------------//
router.get("/sessions/:id", async (req, res) => {
  const { id } = req.params;
  const TeacherSessions = await Session.findAll({
    include: [
      {
        model: Program,
        where: { teacher_id: id },
        attributes: ["program_id", "no_of_sessions"],
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
      {
        model: Student,
        attributes: ["student_first_name", "student_last_name"],
      },
    ],
  });
  res.json(TeacherSessions);
});
//----------------------------------------------------------------------------------------//
router.get("/count", async (req, res) => {
  const TeacherCount = await Teacher.count();
  res.json(TeacherCount);
});
//----------------------------------------------------------------------------------------//
router.post("/", async (req, res) => {
  const teacher = req.body;
  await Teacher.create(teacher);
  res.json(teacher);
});

module.exports = router;
