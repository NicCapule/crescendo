const {
  Session,
  Student,
  Program,
  Teacher,
  Instrument,
  User,
  Enrollment,
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
exports.getProgramDetailsByProgramId = async (req, res) => {
  try {
    const { program_id } = req.query;

    if (!program_id) {
      return res.status(400).json({ error: "Program ID is required!" });
    }

    const program = await Program.findByPk(program_id, {
      attributes: ["program_id"],
    });

    if (!program) {
      return res.status(404).json({ error: "Program not found!" });
    }

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
