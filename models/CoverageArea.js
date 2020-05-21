module.exports = (sequelize, Datatypes) => {
  const CoverageArea = sequelize.define (
    "CoverageArea",
    {
      professional_id: {
        type: Datatypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model:'Professional', key:'id' },
      },
      neighborhood_id: {
        type: Datatypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model:'Neighborhood', key:'id' },
      },
      created_at: Datatypes.DATE,
      updated_at: Datatypes.DATE
    },
    {
      timestamps: true,
      tableName: 'coverage_areas'
    }
  );

  return CoverageArea;
}