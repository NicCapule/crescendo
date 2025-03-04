const {
  Sequelize,
  Student,
  Enrollment,
  Program,
  Instrument,
  Teacher,
  Session,
  User,
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
          include: [
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
