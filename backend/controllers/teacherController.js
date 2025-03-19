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
  TeacherSalary,
} = require("../models");
//----------------------------------------------------------------------------------------//
exports.getTeacherTable = async (req, res) => {
  const TeacherTable = await Teacher.findAll({
    attributes: [
      "teacher_id",
      "user_id",
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
            attributes: [
              "enrollment_id",
              "enroll_date",
              "student_name",
              "instrument",
            ],
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
      {
        model: TeacherSalary,
        order: [["salary_date", "DESC"]],
      },
    ],
  });
  res.json(TeacherDetails);
};
//----------------------------------------------------------------------------------------//
exports.getTeacherProfile = async (req, res) => {
  const { id } = req.params;
  const TeacherProfile = await Teacher.findByPk(id, {
    include: [
      {
        model: Program,
        include: [
          {
            model: Enrollment,
            attributes: [
              "enrollment_id",
              "enroll_date",
              "student_name",
              "instrument",
            ],
          },
        ],
      },
      {
        model: User,
        attributes: ["user_first_name", "user_last_name", "email"],
      },
      {
        model: Instrument,
        attributes: ["instrument_id", "instrument_name"],
      },
      {
        model: TeacherAvailability,
      },
      {
        model: TeacherSalary,
        order: [["salary_date", "DESC"]],
      },
    ],
  });
  res.json(TeacherProfile);
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
//----------------------------------------------------------------------------------------//
exports.getTeacherSalaryByDay = async (req, res) => {
  try {
    const { teacher_id, date } = req.params;

    const selectedDate = new Date(date);
    selectedDate.setUTCHours(0, 0, 0, 0);

    const totalSessions = await Session.count({
      where: {
        session_date: selectedDate,
      },
      include: [
        {
          model: Teacher,
          where: { teacher_id },
          attributes: ["teacher_id"],
        },
      ],
    });

    if (totalSessions === 0) {
      return res
        .status(404)
        .json({ message: "No sessions found for this date." });
    }

    const perSessionRate = 400;

    const amountPaid = totalSessions * perSessionRate;

    const teacher = await Teacher.findByPk(teacher_id, {
      include: [
        { model: User, attributes: ["user_first_name", "user_last_name"] },
      ],
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    const teacherName = `${teacher.User.user_first_name} ${teacher.User.user_last_name}`;

    // Store salary record
    const newSalaryRecord = await TeacherSalary.create({
      teacher_id,
      teacher_name: teacherName,
      total_sessions: totalSessions,
      payment_date: selectedDate,
      amount_paid: amountPaid,
    });

    return res.status(200).json(newSalaryRecord);
  } catch (error) {
    console.error("Error fetching teacher salary:", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve teacher salary." });
  }
};
//----------------------------------------------------------------------------------------//
exports.updateInstruments = async (req, res) => {
  const { id } = req.params;
  const { instruments } = req.body;

  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    if (!instruments || instruments.length === 0) {
      return res.status(400).json({ message: "No instruments provided." });
    }

    const validInstruments = await Instrument.findAll({
      where: { instrument_id: instruments },
    });

    if (validInstruments.length !== instruments.length) {
      return res
        .status(400)
        .json({ message: "Invalid instrument IDs provided." });
    }

    await TeacherInstrument.destroy({
      where: { teacher_id: id },
    });

    const instrumentRecords = instruments.map((instrument_id) => ({
      teacher_id: id,
      instrument_id,
    }));

    await TeacherInstrument.bulkCreate(instrumentRecords);

    res.status(200).json({ message: "Instruments updated successfully." });
  } catch (error) {
    console.error("Error updating instruments:", error);
    res.status(500).json({ error: "Failed to update instruments." });
  }
};
//----------------------------------------------------------------------------------------//
exports.updatePhone = async (req, res) => {
  const { id } = req.params;
  const { teacher_phone } = req.body;

  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    await teacher.update({
      teacher_phone,
    });

    res.status(200).json({ message: "Phone number updated successfully." });
  } catch (error) {
    console.error("Error updating name:", error);
    res.status(500).json({ error: "Failed to update name." });
  }
};
//----------------------------------------------------------------------------------------//
exports.updateAvailability = async (req, res) => {
  const { id } = req.params;
  const { availability } = req.body;

  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }
    if (availability && availability.length > 0) {
      const updatedAvailability = availability.map(
        ({ day_of_week, start_time, end_time }) => ({
          teacher_id: id,
          day_of_week,
          start_time,
          end_time,
        })
      );

      await TeacherAvailability.destroy({
        where: { teacher_id: id },
      });
      await TeacherAvailability.bulkCreate(updatedAvailability);
    }

    res.status(200).json({
      message: "Availability schedules updated successfully.",
    });
  } catch (error) {
    console.error("Error updating availability schedules:", error);
    res.status(500).json({ error: "Failed to update availability schedules." });
  }
};
