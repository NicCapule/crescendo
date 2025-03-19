module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define(
    "Teacher",
    {
      teacher_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      teacher_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "Teacher",
    }
  );

  Teacher.associate = (models) => {
    Teacher.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
    Teacher.hasMany(models.Program, {
      foreignKey: "teacher_id",
      onDelete: "CASCADE",
    });
    Teacher.hasMany(models.TeacherSalary, {
      foreignKey: "teacher_id",
      onDelete: "CASCADE",
    });
    Teacher.hasMany(models.TeacherAvailability, {
      foreignKey: "teacher_id",
      onDelete: "CASCADE",
    });
    Teacher.belongsToMany(models.Instrument, {
      through: "TeacherInstrument",
      foreignKey: "teacher_id",
      onDelete: "CASCADE",
    });
  };

  return Teacher;
};
