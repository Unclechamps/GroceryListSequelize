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
    state : req.body.state
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




app.listen(3000, () => console.log('Example app listening on port 3000!'))
