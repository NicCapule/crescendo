const {
  Sequelize,
  Student,
  Enrollment,
  Program,
  Instrument,
  Teacher,
  Session,
  User,
  sequelize,
} = require("../models");
//----------------------------------------------------------------------------------------//
exports.getStudentTable = async (req, res) => {
  try {
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
      include: [{ model: Enrollment, attributes: [] }],
      group: ["Student.student_id"],
    });
    res.json(StudentTable);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
};
//----------------------------------------------------------------------------------------//
exports.getStudentInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const StudentDetails = await Student.findByPk(id, {
      include: [
        {
          model: Enrollment,
          attributes: [
            "enrollment_id",
            "program_id",
            "enroll_date",
            "teacher_name",
            "total_fee",
            "payment_status",
            "instrument",
          ],
          include: [
            {
              model: Program,
              attributes: ["program_id", "no_of_sessions", "program_status"],
            },
          ],
        },
      ],
    });

    if (!StudentDetails) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(StudentDetails);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student info", error });
  }
};
//----------------------------------------------------------------------------------------//
exports.getStudentSessions = async (req, res) => {
  try {
    const { id } = req.params;
    const StudentSessions = await Session.findAll({
      where: { student_id: id },
      include: [
        {
          model: Student,
          attributes: ["student_first_name", "student_last_name"],
        },
        {
          model: Program,
          include: [
            { model: Instrument, attributes: ["instrument_name"] },
            {
              model: Teacher,
              include: [
                {
                  model: User,
                  attributes: ["user_first_name", "user_last_name"],
                },
              ],
            },
          ],
        },
      ],
    });

    res.json(StudentSessions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student sessions", error });
  }
};

//----------------------------------------------------------------------------------------//
exports.getStudentCount = async (req, res) => {
  try {
    const studentCount = await Student.count();
    res.json(studentCount);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student count", error });
  }
};

//----------------------------------------------------------------------------------------//
exports.createStudent = async (req, res) => {
  try {
    const student = req.body;
    const newStudent = await Student.create(student);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: "Error creating student", error });
  }
};
//----------------------------------------------------------------------------------------//
exports.deleteStudent = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id, {
      attributes: ["student_id", "student_first_name", "student_last_name"],
      transaction,
    });

    if (!student) {
      await transaction.rollback();
      return res.status(404).json({ error: "Student not found" });
    }

    const activeProgramCount = await Enrollment.count({
      where: {
        student_id: student.student_id,
      },
      include: [
        {
          model: Program,
          where: { program_status: "Active" },
        },
      ],
      transaction,
    });

    if (activeProgramCount > 0) {
      await transaction.rollback();
      return res.status(400).json({
        error: "Cannot delete student!",
        details: `${student.student_first_name} ${student.student_last_name} is currently enrolled in one or more active programs.`,
      });
    }

    await student.destroy({ transaction });

    await transaction.commit();

    res.json({
      message: `Student "${student.student_first_name} ${student.student_last_name}" deleted successfully.`,
    });
  } catch (error) {
    await transaction.rollback();
    res
      .status(500)
      .json({ error: "Error deleting student", details: error.message });
  }
};
