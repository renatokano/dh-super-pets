'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'pets',
      'castrated',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'pets',
      'castrated'
    );
  }
};
