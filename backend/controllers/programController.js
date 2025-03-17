const {
  Session,
  Student,
  Program,
  Teacher,
  Instrument,
  User,
  sequelize,
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
exports.forfeitProgram = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    const program = await Program.findByPk(id, { transaction });

    if (!program) {
      await transaction.rollback();
      return res.status(404).json({ message: "Program not found" });
    }

    await program.update({ program_status: "Forfeited" }, { transaction });

    await Session.destroy({
      where: { program_id: id },
      transaction,
    });

    await transaction.commit();
    res.json({ message: "Program forfeited!", program });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Error forfeiting program", error });
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
