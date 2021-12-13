const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var cors = require('cors')
app.use(cors())
require('dotenv').config()
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7t1w1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port=4000

app.get('/',(req,res)=>{
    res.send("lol baby lol")
})


client.connect(err => {
  const dbproducts = client.db("EmaJohnStore").collection("products");
  const orderCollections = client.db("EmaJohnStore").collection("order");
  console.log("db connected")
  app.post('/addProduct',(req,res)=>{
    const allproducts=req.body
    
    dbproducts.insertOne(allproducts)
    .then(results=>{
      res.send(results.acknowledged===true)
    })
  })


  app.get('/products',(req,res)=>{
    dbproducts.find({})
    
    .toArray((err,document)=>{
      res.send(document)
    })
  })



 

  app.get('/product/:key',(req,res)=>{
    dbproducts.find({key:req.params.key})
    .toArray((err,document)=>{
      res.send(document[0])
    })
  })



 app.post('/productsbykeys',(req,res)=>{
   dbproducts.find({key:{$in:req.body}})
   .toArray((err,document)=>{
      res.send(document)
   })
  
 
 })


 app.post('/addOrder',(req,res)=>{
  const order=req.body
  console.log(order)
  
  orderCollections.insertOne(order)
  .then(results=>{
    res.send(results.acknowledged===true)
  })
})
  
  
});


app.listen(process.env.PORT || port)