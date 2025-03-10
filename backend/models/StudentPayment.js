const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const StudentPayment = sequelize.define(
    "StudentPayment",
    {
      student_payment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      enrollment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      student_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount_paid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.ENUM("Cash", "GCash", "Bank Transfer"),
        allowNull: false,
      },
      student_payment_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "StudentPayment",
      timestamps: false,
    }
  );

  StudentPayment.associate = (models) => {
    StudentPayment.belongsTo(models.Enrollment, {
      foreignKey: "enrollment_id",
    });
  };

  return StudentPayment;
};
