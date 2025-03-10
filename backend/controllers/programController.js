const {
  Session,
  Student,
  Program,
  Teacher,
  Instrument,
  User,
} = require("../models");
//----------------------------------------------------------------------------------------//
exports.getAllPrograms = async (req, res) => {
  try {
    const AllPrograms = await Program.findAll();

    res.json({ AllPrograms });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching active program count", error });
  }
};
//----------------------------------------------------------------------------------------//
exports.getActiveProgramCount = async (req, res) => {
  try {
    const activeProgramCount = await Program.count({
      where: { program_status: "Active" },
    });

    res.json(activeProgramCount);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching active program count", error });
  }
};
