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
        type: DataTypes.ENUM("Active", "Completed", "Forfeited"),
        defaultValue: "Active",
        allowNull: false,
      },
    },
    { tableName: "Program", timestamps: false }
  );

  Program.associate = (models) => {
    Program.belongsTo(models.Instrument, {
      foreignKey: "instrument_id",
      onDelete: "CASCADE",
    });
    Program.belongsTo(models.Teacher, {
      foreignKey: "teacher_id",
      onDelete: "CASCADE",
    });
    Program.hasMany(models.Enrollment, {
      foreignKey: "program_id",
      onDelete: "SET NULL",
    });
    Program.hasMany(models.Session, {
      foreignKey: "program_id",
      onDelete: "CASCADE",
    });
  };

  return Program;
};
