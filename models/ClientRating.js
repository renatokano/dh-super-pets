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
          },
          professional_id: {
            type: Datatypes.INTEGER,
            allowNull: false,
        },
          start_time: {
              type: Datatypes.DATE,
              allowNull: false,
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