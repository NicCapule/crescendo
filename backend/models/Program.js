module.exports = (sequelize, DataTypes) => {
  const Program = sequelize.define(
    "Program",
    {
      program_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      instrument_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      no_of_sessions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isIn: [[8, 15]],
        },
      },
      program_status: {
        type: DataTypes.ENUM("Active", "Completed"),
        defaultValue: "Active",
        allowNull: false,
      },
    },
    { tableName: "Program", timestamps: false }
  );

  Program.associate = (models) => {
    Program.belongsTo(models.Instrument, { foreignKey: "instrument_id" });
    Program.belongsTo(models.Teacher, { foreignKey: "teacher_id" });
    Program.hasMany(models.Enrollment, { foreignKey: "program_id" });
    Program.hasMany(models.Session, { foreignKey: "program_id" });
  };

  return Program;
};
