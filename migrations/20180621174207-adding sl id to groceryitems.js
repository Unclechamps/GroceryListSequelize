'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn(
      'GroceryItems',
      'shoppinglist_id',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'grocerylists',
          key : "id"
        }
      }
    )

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn (
      'GroceryItems',
      'shoppinglist_id',
    )
  }
};
