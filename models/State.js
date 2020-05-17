module.exports = (sequelize, Datatypes) => {
  const State = sequelize.define (
    "State",
    {
      id: {
        type: Datatypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Datatypes.STRING(150),
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: 'states'
    }
  );

  // Relationships
  State.associate = (models) => {
    State.hasMany(models.City, {
      foreignKey: "id"
    });
  };

  return State;
}