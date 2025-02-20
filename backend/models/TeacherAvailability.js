module.exports = (sequelize, DataTypes) => {
  const TeacherAvailability = sequelize.define(
    "TeacherAvailability",
    {
      teacher_avail_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      day_of_week: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    {
      tableName: "TeacherAvailability",
      timestamps: false,
    }
  );

  TeacherAvailability.associate = (models) => {
    TeacherAvailability.belongsTo(models.Teacher, {
      foreignKey: "teacher_id",
      onDelete: "CASCADE",
    });
  };

  return TeacherAvailability;
};
