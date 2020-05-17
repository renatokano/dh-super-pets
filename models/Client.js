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
            about_me: Datatypes.STRING(200),
            photo: Datatypes.STRING(200),
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
    };

    return Client;
}