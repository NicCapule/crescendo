module.exports = (sequelize, DataTypes) => {
  const Enrollment = sequelize.define(
    "Enrollment",
    {
      enrollment_id: {
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
      enroll_date: { type: DataTypes.DATE, allowNull: false },
      total_fee: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      enrollment_status: {
        type: DataTypes.ENUM("Active", "Completed"),
        defaultValue: "Active",
      },
    },
    { tableName: "Enrollment", timestamps: false }
  );

  Enrollment.associate = (models) => {
    Enrollment.belongsTo(models.Student, { foreignKey: "student_id" });
    Enrollment.belongsTo(models.Program, { foreignKey: "program_id" });
    Enrollment.hasMany(models.StudentPayment, { foreignKey: "enrollment_id" });
  };

  return Enrollment;
};
