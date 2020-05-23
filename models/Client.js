module.exports = (sequelize, Datatypes) => {
    const Client = sequelize.define(
        "Client", {
            id: {
                type: Datatypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Datatypes.STRING(150),
                allowNull: false
            },
            email: {
                type: Datatypes.STRING(190),
                allowNull: false,
                unique: true
            },
            mobile: {
                type: Datatypes.STRING(20),
                allowNull: false
            },
            zipcode: {
                type: Datatypes.STRING(9),
                allowNull: false
            },
            address: {
                type: Datatypes.STRING(250),
                allowNull: false
            },
            password: {
                type: Datatypes.STRING(250),
                allowNull: false
            },
            about_me: {
                type: Datatypes.STRING(200),
                defaultValue: "Defina uma frase que melhor defina você!!!"
            },
            photo: {
                type: Datatypes.STRING(200),
                defaultValue: "/img/250x250.png"
            },
            created_at: Datatypes.DATE,
            updated_at: Datatypes.DATE,
            neighborhood_id: {
                type: Datatypes.INTEGER,
                allowNull: false
            }
        }, {
            timestamps: false,
            tableName: 'clients'
        }
    );

    // Relationships
    Client.associate = (models) => {
        Client.belongsTo(models.Neighborhood, {
            foreignKey: "neighborhood_id"
        });
        Client.hasMany(models.Pet, {
            foreignKey: "client_id"
        });
    };

    return Client;
}