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

app.get('/groceryitems/:storeID', function(req,res){

  let storeId = req.params.storeID

  models.GroceryItem.findAll({
    where: {
      shoppinglist_id : storeId
    }
  }).then(function(list) {
    res.render('groceryitem', {groceryList : list, store_id : storeId})
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
    res.redirect('/groceryitems/'+storeID+'')
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
      res.redirect('/groceryitems/'+storeID+'')
  })
})


app.listen(3000, () => console.log('Example app listening on port 3000!'))
