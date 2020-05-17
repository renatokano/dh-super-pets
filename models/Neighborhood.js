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
  };

  return Neighborhood;
}