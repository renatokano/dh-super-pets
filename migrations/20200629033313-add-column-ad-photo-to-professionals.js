'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'professionals',
      'adphoto',
      {
        type: Sequelize.STRING(200),
        allowNull: true,
        defaultValue: "https://res.cloudinary.com/superpets/image/upload/v1592952182/pets/800x500_c1pdhr.jpg"
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'pets',
      'adphoto'
    );
  }
};
