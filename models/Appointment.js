module.exports = (sequelize, Datatypes) => {
  const Appointment = sequelize.define(
      "Appointment", {
          client_id: {
              type: Datatypes.INTEGER,
              allowNull: false,
              references: { model:'Appointments', key:'client_id' }
          },
          professional_id: {
            type: Datatypes.INTEGER,
            allowNull: false,
            references: { model:'Appointments', key:'professional_id' }
        },
          start_time: {
              type: Datatypes.DATE,
              allowNull: false,
              references: { model:'Appointments', key:'start_time' }
          },
          status:{
            type: Datatypes.STRING,
            allowNull: false
          },
          price:{
            type: Datatypes.DECIMAL(6,2),
            allowNull: false
          },
          service_id:{
            type: Datatypes.INTEGER,
            allowNull: false
          },         
          created_at: Datatypes.DATE,
          updated_at: Datatypes.DATE,
        }, 
        {
          timestamps: false,
          tableName: 'appointments'
        }
  );

  // Relationships
 Appointment.associate = (models) => {
    Appointment.hasOne(models.ClientRating, {
      foreignKey: "client_id"
  });

    Appointment.hasOne(models.ProfessionalRating, {
        foreignKey: "professional_id"
    });

    Appointment.belongsTo(models.Client, {
      foreignKey: "client_id"
  });

  // Descomente depois de criar o modelo
  //   Appointment.belongsTo(models.AvailableSlots, {
  //       foreignKey: "professional_id"
  // });
  };

  return Appointment;
}