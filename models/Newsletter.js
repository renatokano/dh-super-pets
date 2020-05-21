module.exports = (sequelize, Datatypes) => {
  const Newsletter = sequelize.define (
    "Newsletter",
    {
      id: {
        type: Datatypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Datatypes.STRING(190),
        allowNull: false,
        unique:true
      },
      created_at: Datatypes.DATE,
    },
    {
      timestamps: false,
      tableName: 'newsletter'
    }
  );

  return Newsletter;
}

