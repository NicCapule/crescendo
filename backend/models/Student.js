module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "Student",
    {
      student_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      student_first_name: { type: DataTypes.STRING },
      student_last_name: { type: DataTypes.STRING, allowNull: false },
      student_address: { type: DataTypes.STRING },
      student_age: { type: DataTypes.INTEGER },
      student_email: { type: DataTypes.STRING },
      student_phone: { type: DataTypes.STRING },
    },
    { tableName: "Student" }
  );

  Student.associate = (models) => {
    Student.hasMany(models.Enrollment, {
      foreignKey: "student_id",
      onDelete: "SET NULL",
    });
    Student.hasMany(models.StudentAvailability, {
      foreignKey: "student_id",
      onDelete: "CASCADE",
    });
    Student.hasMany(models.Session, {
      foreignKey: "student_id",
      onDelete: "CASCADE",
    });
  };

  return Student;
};
