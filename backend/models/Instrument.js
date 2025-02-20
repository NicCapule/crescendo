module.exports = (sequelize, DataTypes) => {
  const Instrument = sequelize.define(
    "Instrument",
    {
      instrument_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      instrument_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "Instrument",
      timestamps: false,
    }
  );

  Instrument.associate = (models) => {
    Instrument.hasMany(models.Program, { foreignKey: "instrument_id" });
    Instrument.belongsToMany(models.Teacher, {
      through: "TeacherInstrument",
      foreignKey: "instrument_id",
    });
  };

  return Instrument;
};
