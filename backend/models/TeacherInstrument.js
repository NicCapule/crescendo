module.exports = (sequelize, DataTypes) => {
  const TeacherInstrument = sequelize.define(
    "TeacherInstrument",
    {
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      instrument_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: "TeacherInstrument",
      timestamps: false,
    }
  );

  TeacherInstrument.associate = (models) => {
    TeacherInstrument.belongsTo(models.Teacher, {
      foreignKey: "teacher_id",
      onDelete: "CASCADE",
    });

    TeacherInstrument.belongsTo(models.Instrument, {
      foreignKey: "instrument_id",
      onDelete: "CASCADE",
    });
  };

  return TeacherInstrument;
};
