const {
  Session,
  Student,
  Program,
  Teacher,
  Instrument,
  TeacherAvailability,
  User,
  Enrollment,
  sequelize,
} = require("../models");

const { Op } = require("sequelize");
//----------------------------------------------------------------------------------------//
exports.getScheduledSessions = async (req, res) => {
  try {
    const AllSession = await Session.findAll({
      where: { session_status: "Scheduled" },
      include: [
        {
          model: Student,
          attributes: ["student_id", "student_first_name", "student_last_name"],
        },
        {
          model: Program,
          attributes: ["program_id"],
          include: [
            {
              model: Teacher,
              attributes: ["teacher_id"],
              include: [
                {
                  model: User,
                  attributes: ["user_first_name", "user_last_name"],
                },
              ],
            },
            {
              model: Instrument,
            },
          ],
        },
      ],
    });
    res.json(AllSession);
  } catch (error) {
    console.error("Error fetching upcoming sessions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//----------------------------------------------------------------------------------------//
exports.getUpcomingSessions = async (req, res) => {
  try {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toTimeString().split(" ")[0];

    const upcomingSessions = await Session.findAll({
      where: {
        session_status: "Scheduled",
        [Op.or]: [
          { session_date: { [Op.gte]: formattedDate } },
          {
            session_date: formattedDate,
            session_start: { [Op.gt]: formattedTime },
          },
        ],
      },
      include: [
        Student,
        {
          model: Program,
          include: [
            {
              model: Teacher,
              include: [
                {
                  model: User,
                  attributes: ["user_first_name", "user_last_name"],
                },
              ],
            },
            {
              model: Instrument,
            },
          ],
        },
      ],
      order: [
        ["session_date", "ASC"],
        ["session_start", "ASC"],
      ],
    });

    res.json(upcomingSessions);
  } catch (error) {
    console.error("Error fetching upcoming sessions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//----------------------------------------------------------------------------------------//
exports.getSchedulesForValidation = async (req, res) => {
  try {
    const { teacherId } = req.query;

    if (!teacherId) {
      return res.status(400).json({ error: "Teacher ID is required" });
    }

    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toTimeString().split(" ")[0];

    // Get Teacher's Availability
    const teacherAvailability = await TeacherAvailability.findAll({
      where: { teacher_id: teacherId },
      attributes: ["day_of_week", "start_time", "end_time"],
    });

    // Get Scheduled Sessions for Selected Teacher
    const teacherSessions = await Session.findAll({
      where: {
        session_status: "Scheduled",
        [Op.or]: [
          { session_date: { [Op.gt]: formattedDate } },
          {
            session_date: formattedDate,
            session_start: { [Op.gt]: formattedTime },
          },
        ],
      },
      include: [
        {
          model: Program,
          where: { teacher_id: teacherId },
          required: true,
        },
      ],
    });

    // Get All Sessions to Enforce Max 4 Sessions Per Time Slot
    const allSessions = await Session.findAll({
      where: {
        session_status: "Scheduled",
        [Op.or]: [
          { session_date: { [Op.gt]: formattedDate } },
          {
            session_date: formattedDate,
            session_start: { [Op.gt]: formattedTime },
          },
        ],
      },
      attributes: ["session_date", "session_start"],
    });

    // Get Time Slots That Already Have a Drum Session
    const drumSessions = await Session.findAll({
      attributes: ["session_date", "session_start"],
      include: [
        {
          model: Program,
          attributes: [],
          required: true,
          include: [
            {
              model: Instrument,
              attributes: [],
              required: true,
              where: { instrument_name: "Drums" },
            },
          ],
        },
      ],
      where: {
        session_status: "Scheduled",
        [Op.or]: [
          { session_date: { [Op.gt]: formattedDate } },
          {
            session_date: formattedDate,
            session_start: { [Op.gt]: formattedTime },
          },
        ],
      },
    });

    // Extract occupied drum session slots
    const occupiedDrumSlots = drumSessions.map((session) => ({
      session_date: session.session_date,
      session_start: session.session_start,
    }));

    res.json({
      // formattedDate,
      // formattedTime,
      teacherAvailability,
      teacherSessions,
      allSessions,
      occupiedDrumSlots,
    });
  } catch (error) {
    console.error("Error fetching schedules for enrollment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//----------------------------------------------------------------------------------------//
exports.getSessionsByProgramId = async (req, res) => {
  try {
    const { program_id } = req.query;

    if (!program_id) {
      return res.status(400).json({ error: "Program ID is required!" });
    }

    const ProgramSessions = await Session.findAll({
      where: {
        program_id: program_id,
      },
      attributes: [
        "session_id",
        "session_number",
        "session_date",
        "session_start",
        "session_end",
        "attendance",
        "session_status",
      ],
    });

    res.json({ ProgramSessions });
  } catch (error) {
    console.error(
      `Error fetching sessions of program ${
        req.query.program_id || "unknown"
      }:`,
      error
    );
    res.status(500).json({ error: "Internal server error" });
  }
};
//----------------------------------------------------------------------------------------//
exports.getProgramDetailsBySessionId = async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: "Session ID is required!" });
    }

    const session = await Session.findByPk(session_id, {
      attributes: ["program_id"],
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found!" });
    }

    const program_id = session.program_id;

    // Fetch program details
    const SelectedProgram = await Program.findByPk(program_id, {
      include: [
        {
          model: Teacher,
          attributes: ["user_id"],
          include: [
            {
              model: User,
              attributes: ["user_first_name", "user_last_name"],
            },
          ],
        },
        {
          model: Instrument,
          attributes: ["instrument_name"],
        },
        {
          model: Enrollment,
          attributes: ["enrollment_id", "enroll_date"],
          include: [
            {
              model: Student,
              attributes: ["student_first_name", "student_last_name"],
            },
          ],
        },
      ],
    });

    if (!SelectedProgram) {
      return res.status(404).json({ error: "Program not found!" });
    }

    const ProgramSessions = await Session.findAll({
      where: { program_id },
      attributes: [
        "session_id",
        "session_number",
        "session_date",
        "session_start",
        "session_end",
        "attendance",
        "session_status",
      ],
      order: [
        ["session_date", "ASC"], // Order by session_date first
        ["session_start", "ASC"], // Then order by session_start within the same date
      ],
    });

    res.json({ SelectedProgram, ProgramSessions });
  } catch (error) {
    console.error(
      `Error fetching program details for session ${
        req.query.session_id || "unknown"
      }:`,
      error
    );
    res.status(500).json({ error: "Internal server error" });
  }
};
//----------------------------------------------------------------------------------------//
exports.rescheduleSession = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { session_id, new_date, new_start_time, new_end_time } = req.body;

    if (!session_id || !new_date || !new_start_time || !new_end_time) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const session = await Session.findByPk(session_id, { transaction });

    if (!session) {
      await transaction.rollback();
      return res.status(404).json({ error: "Session not found!" });
    }
    await session.update({ session_status: "Rescheduled" }, { transaction });

    const newSession = await Session.create(
      {
        student_id: session.student_id,
        program_id: session.program_id,
        session_number: session.session_number,
        session_date: new_date,
        session_start: new_start_time,
        session_end: new_end_time,
        session_status: "Scheduled",
      },
      { transaction }
    );

    await transaction.commit();
    res.json({
      message: "Session rescheduled successfully!",
      originalSession: session,
      newSession,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rescheduling session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//----------------------------------------------------------------------------------------//
exports.forfeitSession = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    const session = await Session.findByPk(id, { transaction });

    if (!session) {
      await transaction.rollback();
      return res.status(404).json({ message: "Session not found" });
    }

    await session.update({ session_status: "Forfeited" }, { transaction });

    await transaction.commit();
    res.json({ message: "Session forfeited!", session });
  } catch (error) {
    await transaction.rollback();
    console.error("Error forfeiting session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//----------------------------------------------------------------------------------------//
exports.markAttendance = async (req, res) => {
  const transaction = await sequelize.transaction();
  const { id } = req.params;
  const { attendance } = req.body;

  try {
    const session = await Session.findByPk(id, { transaction });

    if (!session) {
      await transaction.rollback();
      return res.status(404).json({ error: "Session not found" });
    }

    await session.update({ attendance: attendance || null }, { transaction });
    await transaction.commit();

    res.json({
      message:
        attendance === null
          ? "Attendance cleared!"
          : `Attendance marked as ${attendance}!`,
      session,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
