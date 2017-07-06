const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db;

MongoClient.connect('mongodb://wandererbear:wandererbear@ds147882.mlab.com:47882/first-test', (err, database) => {
  if (err) return console.log(err)
  db = database;
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
    console.log('connect to db of mlab/wandererbear/first-test')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

app.get('/',(req,res) => {
  db.collection('quotes').find().toArray(function(err, result) {
    if (err) return console.log(err)
    res.render('index.ejs', {quotes: result})
  })
})

app.post('/quotes', (req, res) => {
  db.collection('quotes').save((req.body), (err, result) => {
    if (err) return console.log(err)
    console.log('save to db')    
    res.redirect('/') 
  })
})