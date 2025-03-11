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
        allowNull: true,
      },
      program_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      student_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      student_email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      teacher_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      instrument: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      enroll_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      total_fee: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      payment_status: {
        type: DataTypes.ENUM("Settled", "Unsettled"),
        allowNull: false,
      },
    },
    { tableName: "Enrollment", timestamps: false }
  );

  Enrollment.associate = (models) => {
    Enrollment.belongsTo(models.Student, {
      foreignKey: "student_id",
      onDelete: "SET NULL",
    });
    Enrollment.belongsTo(models.Program, {
      foreignKey: "program_id",
      onDelete: "SET NULL",
    });
    Enrollment.hasMany(models.StudentPayment, { foreignKey: "enrollment_id" });
  };

  return Enrollment;
};
