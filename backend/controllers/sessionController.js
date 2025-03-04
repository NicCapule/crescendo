const {
  Session,
  Student,
  Program,
  Teacher,
  Instrument,
  User,
} = require("../models");
//----------------------------------------------------------------------------------------//
exports.getAllSessions = async (req, res) => {
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
};
