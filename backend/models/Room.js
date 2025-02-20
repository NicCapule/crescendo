module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    "Room",
    {
      room_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      room_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      has_piano: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      has_drums: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "Room",
      timestamps: false,
    }
  );

  Room.associate = (models) => {
    Room.hasMany(models.Session, { foreignKey: "room_id" });
  };

  return Room;
};
