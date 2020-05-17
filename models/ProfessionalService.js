module.exports = (sequelize, Datatypes) => {
    const ProfessionalService = sequelize.define (
      "ProfessionalService",
      {
        professional_id: {
            type: Datatypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Professional',
                key: 'id'
            }
        },
        service_id: {
            type: Datatypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Service',
                key: 'id'
            }
        },
        price: Datatypes.DECIMAL(6, 2),
        created_at: Datatypes.DATE,
        updated_at: Datatypes.DATE
      },
      {
        timestamps: false,
        tableName: 'professional_services'
      }
    );
  
    return ProfessionalService;
  }