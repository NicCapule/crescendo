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
      room_id: {
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
      indexes: [
        {
          unique: true,
          fields: ["room_id", "session_date", "session_start", "session_end"],
          name: "unique_room_schedule",
        },
      ],
    }
  );

  Session.associate = (models) => {
    Session.belongsTo(models.Student, { foreignKey: "student_id" });
    Session.belongsTo(models.Program, { foreignKey: "program_id" });
    Session.belongsTo(models.Room, { foreignKey: "room_id" });
  };

  return Session;
};
