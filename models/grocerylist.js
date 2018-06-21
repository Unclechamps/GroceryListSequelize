'use strict';
module.exports = (sequelize, DataTypes) => {
  var grocerylist = sequelize.define('grocerylist', {
    name: DataTypes.STRING,
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING
  }, {});


  grocerylist.associate = function(models) {
    // associations can be defined here
    grocerylist.hasMany(models.GroceryItem, { as : 'groceryitem', foreignKey: 'shoppinglist_id' })

  };
  return grocerylist;
};
