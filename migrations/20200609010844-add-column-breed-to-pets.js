'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'pets',
      'breed',
      {
        type: Sequelize.STRING(50),
        allowNull: true
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'pets',
      'breed'
    );
  }
};
