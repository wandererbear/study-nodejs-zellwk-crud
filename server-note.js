const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db;

// Connect to db (user+pw ของ db นี้เท่านั้นไม่ใช่ของ web)
MongoClient.connect('mongodb://wandererbear:wandererbear@ds147882.mlab.com:47882/first-test', (err, database) => {
  if (err) return console.log(err)
  db = database;
  app.listen(3000,() => {
    console.log('listening on 3000')
    console.log('connect to db of mlab/wandererbear/first-test')
  })
})

// ejs คล้ายแนว jade มั้นหาได้เองว่า file ejs อยู่ folder ไหน
// เราสร้างที่ views/index.ejs
// <% ใช้jsใน หน้าhtml ejs ได้ %>
// <%= พิมพ์ variable เป็น template string %>
app.set('view engine', 'ejs')

// setup app
app.use(bodyParser.urlencoded({extended: true}))

// crud
app.get('/',(req,res) => {
  // res.send('Hello world!...')
  // res.sendFile(__dirname + '/index.html')

  // cursor(SELECT * FROM quotes) แต่อ่านไม่รู้เรื่องมันยาว
  // var cursor = db.collection('quotes').find()

  // ต้อง .toArray ก่อนได้อ่านออก
  db.collection('quotes').find().toArray(function(err, result) {
    // console.log(results) 
    /* ได้
      [ 
        { _id: 595e4091cb641b1bc54119d3,
        name: 'wandererbear',
        quote: 'first quote' },
      ]
    */
    if (err) return console.log(err)

    // สร้าง object ชื่อ quotes เก็บ result จาก db 
    // ส่งไป render ที่หน้า index.ejs
    // เรียก ผ่าน quotes.name quotes.email
    res.render('index.ejs', {quotes: result})
  })
})

app.post('/quotes', (req, res) => {
  // req มันเยอะมากอ่านไม่รู้เรื่องต้องใช้(npm install body-parser)
  // const bodyParser = require('body-parser')
  // app.use(bodyParser.urlencoded({extended: true}))
  // ใช้req.bodyได้ละ => { name: 'a', quote: 'b' }
  // console.log(req.body)

  // SELECT * FROM quotes
  db.collection('quotes').save((req.body), (err, result) => {
    if (err) return console.log(err)
    console.log('save to db')    
    // ให้ส่งแล้วกลับหน้า home ไม่งั้นหน้ารำคาญเพราะมันไม่มีหน้า /quotes อยู่จริงๆ
    res.redirect('/') 
  }  
})