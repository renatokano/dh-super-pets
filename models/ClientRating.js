module.exports = (sequelize, Datatypes) => {
  const ClientRating = sequelize.define(
      "ClientRating", {
          id: {
              type: Datatypes.INTEGER,
              primaryKey: true,
              autoIncrement: true
          },
          rating: {
              type: Datatypes.INTEGER,
              allowNull: false,
              rating:{min:1,max:5}
          },
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
          created_at: Datatypes.DATE,
          updated_at: Datatypes.DATE,
        }, 
        {
          timestamps: false,
          tableName: 'client_ratings'
        }
  );

  return ClientRating;
}