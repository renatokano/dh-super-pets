'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'pets',
      'birth',
      {
        type: Sequelize.DATEONLY,
        allowNull: true
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'pets',
      'birth'
    );
  }
};
