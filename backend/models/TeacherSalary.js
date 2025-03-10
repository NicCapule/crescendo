module.exports = (sequelize, DataTypes) => {
  const TeacherSalary = sequelize.define(
    "TeacherSalary",
    {
      salary_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      teacher_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_sessions: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      amount_paid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "TeacherSalary",
      timestamps: false,
    }
  );

  TeacherSalary.associate = (models) => {
    TeacherSalary.belongsTo(models.Teacher, {
      foreignKey: "teacher_id",
    });
  };

  return TeacherSalary;
};
