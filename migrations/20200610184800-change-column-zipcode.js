'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.changeColumn(
        'professionals',
        'zipcode',
        {
          type: Sequelize.STRING(9),
          allowNull: true
        }
      );
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.changeColumn(
        'professionals',
        'zipcode',
        {
          type: Sequelize.STRING(9),
          allowNull: false
        }

      );
    }
  };
  