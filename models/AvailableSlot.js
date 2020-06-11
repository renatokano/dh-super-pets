module.exports = (sequelize, Datatypes) => {
  const AvailableSlot = sequelize.define(
      "AvailableSlot", {
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
          created_at: Datatypes.DATE,
          updated_at: Datatypes.DATE,
        }, 
        {
          timestamps: false,
          tableName: 'available_slots'
        }
  );

  return AvailableSlot;
}