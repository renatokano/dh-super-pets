'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'pets',
      'photo',
      {
        type: Sequelize.STRING(200),
        allowNull: true,
        defaultValue: "800x500.png"
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'pets',
      'photo'
    );
  }
};
