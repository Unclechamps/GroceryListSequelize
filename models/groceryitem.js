'use strict';
module.exports = (sequelize, DataTypes) => {
  var GroceryItem = sequelize.define('GroceryItem', {
    item_name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {});


  GroceryItem.associate = function(models) {
    // associations can be defined here
    GroceryItem.belongsTo(models.grocerylist, {as : 'grocerylist', foreignKey: 'shoppinglist_id'})

  };
  return GroceryItem;
};
