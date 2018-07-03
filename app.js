const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const promise = require('bluebird')

let models = require('./models')

// telling pg-promise that we will be using bluebird
// as the promise library
let options = {
  promiseLib : promise
}

let pgp = require('pg-promise')(options)
let connectionString = 'postgres://localhost:5432/seqgroceries'
let db = pgp(connectionString)

app.use(express.static('public'))

app.engine('mustache',mustacheExpress())
app.use(bodyParser.urlencoded({extended :false}))

app.set('views','./views')
app.set('view engine','mustache')

// ADDING A LIST //

app.post('/shoppinglist',function(req,res){

  let store = {
    name : req.body.name,
    street : req.body.street,
    city : req.body.city,
    state : req.body.state,
    id : req.body.id
  }

  models.grocerylist.create(store).then(function(){
    res.redirect('/shoppinglist')
  })
})

app.get('/shoppinglist', function(req,res){
  models.grocerylist.findAll().then(function(stores) {
    res.render('shoppinglist', {storeList : stores})
  })
})

// DELETING STORE //

app.post('/deleteList', function(req,res) {
  models.grocerylist.destroy({
    where: {
      id : req.body.delete
    }
    }).then(function(){
      res.redirect('/shoppinglist')
  })
})

// MOVE TO ADD ITEMS PAGE //

app.get('/groceryitems/:storeName/:storeID', function(req,res){

  let storeName = req.params.storeName
  let storeId = req.params.storeID

  models.GroceryItem.findAll({
    where: {
      shoppinglist_id : storeId
    }
  }).then(function(list) {
    res.render('groceryitem', {groceryList : list, store_id : storeId, name : storeName})
})
})


// POST ITEM //

app.post('/individualItems',function(req,res){

    let item = {
      shoppinglist_id : req.body.store_id,
      item_name : req.body.groceryItem,
      quantity : req.body.quantity,
      price : req.body.price

    }

  models.GroceryItem.create(item).then(function(){
    let storeID = req.body.store_id
    let name = req.body.name
    res.redirect('/groceryitems/'+name+'/'+storeID+'')
  })
})

// DELETING ITEM //

app.post('/deleteItem', function(req,res) {
  models.GroceryItem.destroy({

    where: {
      id : req.body.delete
    }
    }).then(function(){
      let storeID = req.body.store
      let name = req.body.storeName
      res.redirect('/groceryitems/'+name+'/'+storeID+'')
  })
})

//MODIFY ITEM//

app.post('/modify', function(req,res) {
  let quantity = req.body.quantity
  models.GroceryItem.update({quantity : (parseInt(quantity) + parseInt(req.body.amtModify))},

{
  where: {
    id : req.body.modifyQty
  }
}).then(function(){
  let storeID = req.body.store
  let name = req.body.storeName
  res.redirect('/groceryitems/'+name+'/'+storeID+'')
  })
})

// ADD TO CART //

app.post('/addToCart', function(req,res) {

  let cartItem = {
    item_name : req.body.item_name,
    quantity : req.body.qtyToCart,
    price : req.body.price,
    totalAmt : (parseInt(req.body.qtyToCart) * parseInt(req.body.price))
  }

  models.GroceryItem.findOne({ where : {id : req.body.modifyQty}}).then(function(itemInventory){
    let itemQuantity = itemInventory.quantity
    if(req.body.qtyToCart > itemQuantity) {
      // error
    } else {
      models.Cart.create(cartItem).then(function(){
        let invQuantity = req.body.quantity
        models.GroceryItem.update({quantity : (parseInt(invQuantity) - parseInt(req.body.qtyToCart))},
      {
        where: {
          id : req.body.modifyQty
        }
      }).then(function() {
        res.redirect('/cart')
      })
    })}
  })
})


app.get('/cart', function(req,res){
  models.Cart.findAll().then(function(cartItems) {
    res.render('cart', {cart : cartItems})
  })
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
