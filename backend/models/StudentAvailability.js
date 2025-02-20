module.exports = (sequelize, DataTypes) => {
  const StudentAvailability = sequelize.define(
    "StudentAvailability",
    {
      student_avail_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: { type: DataTypes.INTEGER, allowNull: false },
      day_of_week: DataTypes.STRING,
      start_time: DataTypes.TIME,
      end_time: DataTypes.TIME,
    },
    { tableName: "StudentAvailability", timestamps: false }
  );

  StudentAvailability.associate = (models) => {
    StudentAvailability.belongsTo(models.Student, {
      foreignKey: "student_id",
      onDelete: "CASCADE",
    });
  };

  return StudentAvailability;
};
