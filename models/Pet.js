/*
  Pet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    weight DECIMAL(6,2),
    client_id INT NOT NULL,
    pet_type_id INT NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
  );
*/

module.exports = (sequelize, DataTypes) => {
  const Pet = sequelize.define(
    "Pet",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      weight: {
        type: DataTypes.DECIMAL(6,2)
      },
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      pet_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE
    },
    {
      timestamps: false,
      tableName: "pets"
    }
  );
  
  /*
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (pet_type_id) REFERENCES pet_types(id)
  */
  // Relationships
  Pet.associate = models => {
    Pet.belongsTo(models.Client, {
      foreignKey: "client_id"
    });
    Pet.belongsTo(models.PetType, {
      foreignKey: "pet_type_id"
    })
  }

  return Pet;
}