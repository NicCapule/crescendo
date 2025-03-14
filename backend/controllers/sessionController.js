const {
  Session,
  Student,
  Program,
  Teacher,
  Instrument,
  TeacherAvailability,
  User,
} = require("../models");

const { Op } = require("sequelize");
//----------------------------------------------------------------------------------------//
exports.getAllSessions = async (req, res) => {
  try {
    const AllSession = await Session.findAll({
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
exports.getSchedulesForEnrollment = async (req, res) => {
  try {
    const { teacherId } = req.query;

    if (!teacherId) {
      return res.status(400).json({ error: "Teacher ID is required" });
    }

    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toTimeString().split(" ")[0];

    // 1️⃣ Get Teacher's Availability
    const teacherAvailability = await TeacherAvailability.findAll({
      where: { teacher_id: teacherId },
      attributes: ["day_of_week", "start_time", "end_time"],
    });

    // 2️⃣ Get Scheduled Sessions for Selected Teacher
    const teacherSessions = await Session.findAll({
      where: {
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
        },
      ],
    });

    // 3️⃣ Get All Sessions to Enforce Max 4 Sessions Per Time Slot
    const allSessions = await Session.findAll({
      where: {
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

    // 4️⃣ Get Time Slots That Already Have a Drum Session
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
