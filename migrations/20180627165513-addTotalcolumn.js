'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn(
      'Carts',
      'totalAmt',
      {
        type: Sequelize.INTEGER
      }
    )

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn (
      'Carts',
      'totalAmt',
    )
  }
};
