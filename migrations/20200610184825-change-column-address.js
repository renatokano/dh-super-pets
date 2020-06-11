'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.changeColumn(
        'professionals',
        'address',
        {
          type: Sequelize.STRING(250),
          allowNull: true
        }
      );
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.changeColumn(
        'professionals',
        'address',
        {
          type: Sequelize.STRING(250),
          allowNull: false
        }

      );
    }
  };
  