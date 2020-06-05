module.exports = (sequelize, Datatypes) => {
  const AvailableSlots = sequelize.define(
      "AvailableSlots", {
          professional_id: {
          type: Datatypes.INTEGER,
          allowNull: false,
          references: { model:'AvailableSlots', key:'professional_id' }
         },
          start_time: {
              type: Datatypes.DATE,
              allowNull: false
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

  // Relationships
 AvailableSlots.associate = (models) => {
  AvailableSlots.hasMany(models.Appointment, {
        foreignKey: "professional_id"
    });

 AvailableSlots.belongsTo(models.Professionals, {
      foreignKey: "professional_id"
  });
  
  };

  return AvailableSlots;
}