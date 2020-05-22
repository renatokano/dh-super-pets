module.exports = (sequelize, Datatypes) => {
  const City = sequelize.define (
    "City",
    {
      id: {
        type: Datatypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Datatypes.STRING(150),
        allowNull: false
      },
      state_id: {
        type: Datatypes.INTEGER,
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: 'cities'
    }
  );

  // Relationships
  City.associate = (models) => {
    City.belongsTo(models.State, {
      foreignKey: "state_id"
    });
    City.hasMany(models.Neighborhood, {
      foreignKey: "city_id"
    });
  };

  return City;
}