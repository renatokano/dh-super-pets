module.exports = (sequelize, Datatypes) => {
    const Professional = sequelize.define(
        "Professional", {
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
                allowNull: true
            },
            address: {
                type: Datatypes.STRING(250),
                allowNull: true
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
                defaultValue: "250x250.png"
            },
            created_at: Datatypes.DATE,
            updated_at: Datatypes.DATE,
            neighborhood_id: {
                type: Datatypes.INTEGER,
                allowNull: false
            },
            adphoto: {
                type: Datatypes.STRING(200),
                defaultValue: "https://res.cloudinary.com/superpets/image/upload/v1592952182/pets/800x500_c1pdhr.jpg"
            },
        }, {
            timestamps: false,
            tableName: 'professionals'
        }
    );

    // Relationships
    Professional.associate = (models) => {
        Professional.belongsTo(models.Neighborhood, {
            foreignKey: "neighborhood_id"
        });
        Professional.belongsToMany(models.Service, {
            through: 'ProfessionalService',
            foreignKey: 'professional_id'
        });
        Professional.belongsToMany(models.Neighborhood, {
            through: 'CoverageArea',
            foreignKey: "professional_id",
            as: "coverage_areas"
        })
    };

    return Professional;
}