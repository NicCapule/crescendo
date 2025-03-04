const bcrypt = require("bcryptjs");
const {
  Sequelize,
  Teacher,
  User,
  Instrument,
  Program,
  Enrollment,
  Student,
  Session,
  TeacherInstrument,
  TeacherAvailability,
} = require("../models");
//----------------------------------------------------------------------------------------//
exports.getTeacherTable = async (req, res) => {
  const TeacherTable = await Teacher.findAll({
    attributes: [
      "teacher_id",
      "teacher_phone",
      [
        Sequelize.fn("COUNT", Sequelize.col("Programs.program_id")),
        "total_programs",
      ],
    ],
    include: [
      {
        model: User,
        attributes: ["user_first_name", "user_last_name", "email"],
      },
      {
        model: Program,
        attributes: [],
      },
      {
        model: Instrument,
        attributes: ["instrument_name"],
      },
    ],
    group: ["Teacher.teacher_id", "User.user_id", "Instruments.instrument_id"],
  });
  res.json(TeacherTable);
};
//----------------------------------------------------------------------------------------//
exports.getTeacherInfo = async (req, res) => {
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
        attributes: ["user_first_name", "user_last_name", "email"],
      },
      {
        model: Instrument,
        attributes: ["instrument_name"],
      },
    ],
  });
  res.json(TeacherDetails);
};
//----------------------------------------------------------------------------------------//
exports.getTeacherSessions = async (req, res) => {
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
            include: [
              {
                model: User,
                attributes: ["user_first_name", "user_last_name"],
              },
            ],
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
};
//----------------------------------------------------------------------------------------//
exports.createTeacher = async (req, res) => {
  const {
    user_first_name,
    user_last_name,
    teacher_phone,
    email,
    password,
    instruments,
    availability,
  } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }
    //----------------------------------------------------------------------------//
    const hashedPassword = await bcrypt.hash(password, 10);
    //----------------------------------------------------------------------------//
    const newUser = await User.create({
      user_first_name,
      user_last_name,
      email,
      password: hashedPassword,
      role: "Teacher",
    });

    const newTeacher = await Teacher.create({
      user_id: newUser.user_id,
      teacher_phone,
    });

    if (instruments && instruments.length > 0) {
      const instrumentRecords = instruments.map((instrument_id) => ({
        teacher_id: newTeacher.teacher_id,
        instrument_id,
      }));
      await TeacherInstrument.bulkCreate(instrumentRecords);
    }

    if (availability && availability.length > 0) {
      const availabilityRecords = availability.map(
        ({ day_of_week, start_time, end_time }) => ({
          teacher_id: newTeacher.teacher_id,
          day_of_week,
          start_time,
          end_time,
        })
      );
      await TeacherAvailability.bulkCreate(availabilityRecords);
    }

    res.status(201).json({ user: newUser, teacher: newTeacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//----------------------------------------------------------------------------------------//
exports.getTeacherCount = async (req, res) => {
  const TeacherCount = await Teacher.count();
  res.json(TeacherCount);
};
