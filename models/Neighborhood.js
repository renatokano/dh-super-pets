module.exports = (sequelize, Datatypes) => {
  const Neighborhood = sequelize.define (
    "Neighborhood",
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
      city_id: {
        type: Datatypes.INTEGER,
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: 'neighborhoods'
    }
  );

  // Relationships
  Neighborhood.associate = (models) => {
    Neighborhood.belongsTo(models.City, {
      foreignKey: "city_id"
    });
    Neighborhood.hasMany(models.Client, {
      foreignKey: "neighborhood_id"
    });
    Neighborhood.hasMany(models.Professional, {
      foreignKey: "neighborhood_id"
    });
    Neighborhood.belongsToMany(models.Professional, {
      through: "CoverageArea",
      foreignKey: "neighborhood_id",
      as: "coverage_areas"
    })
  };

  return Neighborhood;
}