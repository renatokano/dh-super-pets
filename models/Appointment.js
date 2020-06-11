module.exports = (sequelize, Datatypes) => {
  const Appointment = sequelize.define(
      "Appointment", {
          client_id: {
              type: Datatypes.INTEGER,
              allowNull: false,
              primaryKey: true
          },
          professional_id: {
            type: Datatypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
          start_time: {
              type: Datatypes.DATE,
              allowNull: false,
              primaryKey: true
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

  return Appointment;
}