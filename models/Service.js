module.exports = (sequelize, Datatypes) => {
    const Service = sequelize.define (
      "Service",
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
        tableName: 'services'
      }
    ); 
    
    // Relationships
    Service.associate = (models) => {
      Service.belongsToMany(models.Professional, {
          through: 'ProfessionalService',
          foreignKey: 'service_id'
      });
  };
    
    return Service;
  }