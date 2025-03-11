const {
  Session,
  Student,
  Program,
  Teacher,
  Instrument,
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
