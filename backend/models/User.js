module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("Admin", "Teacher"),
        allowNull: false,
      },
    },
    {
      tableName: "User",
      timestamps: false,
    }
  );

  User.associate = (models) => {
    User.hasOne(models.Teacher, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
  };

  return User;
};
