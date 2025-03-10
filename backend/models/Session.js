module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define(
    "Session",
    {
      session_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      program_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      session_number: { type: DataTypes.INTEGER, allowNull: false },
      session_date: { type: DataTypes.DATEONLY, allowNull: false },
      session_start: { type: DataTypes.TIME, allowNull: false },
      session_end: { type: DataTypes.TIME, allowNull: false },
      attendance: DataTypes.ENUM("Present", "Absent", "Late"),
      session_status: {
        type: DataTypes.ENUM("Scheduled", "Completed", "Canceled", "Forfeited"),
        defaultValue: "Scheduled",
      },
    },
    {
      tableName: "Session",
      timestamps: false,
      hooks: {
        beforeCreate: async (session, options) => {
          await validateSession(session);
        },
        beforeBulkCreate: async (sessions, options) => {
          for (const session of sessions) {
            await validateSession(session);
          }
        },
      },
    }
  );
  //------------------------------------------------------------------------//
  async function validateSession(session) {
    const { session_date, session_start, session_end, program_id } = session;
    const { Program } = sequelize.models;

    // Count sessions at the same date and time slot
    const existingSessions = await Session.count({
      where: {
        session_date,
        session_start,
      },
    });

    if (existingSessions >= 4) {
      throw new Error(
        "Cannot book more than 4 sessions in the same time slot."
      );
    }

    // Get instrument type for the program
    const program = await Program.findByPk(program_id);
    if (!program) {
      throw new Error("Invalid program_id.");
    }

    // Check if an existing Drum session is in the same time slot
    if (program.instrument_id === "Drums") {
      const drumSessionExists = await Session.findOne({
        where: {
          session_date,
          session_start,
        },
        include: [
          {
            model: Program,
            attributes: ["instrument_id"],
            where: { instrument_name: "Drums" },
          },
        ],
      });

      if (drumSessionExists) {
        throw new Error("Only 1 drum session allowed per time slot.");
      }
    }
  }
  //------------------------------------------------------------------------//
  Session.associate = (models) => {
    Session.belongsTo(models.Student, {
      foreignKey: "student_id",
      onDelete: "CASCADE",
    });
    Session.belongsTo(models.Program, {
      foreignKey: "program_id",
      onDelete: "CASCADE",
    });
  };

  return Session;
};
