/*
  PetType (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL
*/

module.exports = (sequelize, DataTypes) => {
  const PetType = sequelize.define(
    "PetType", 
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false
      }
    },{
      timestamps: false,
      tableName: 'pet_types'
    }
  );

  // Relationships
  // pet_types-(1:n)-pets-(n:1)-clients
  PetType.associate = models => {
    PetType.hasMany(models.Pet, {
      foreignKey: "id"
    });
  }

  return PetType;
}