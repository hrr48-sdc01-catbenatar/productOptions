const express = require('express');
const app = express();
const port = 3002;

const db = require('./database/models');
const data = require('./data/testData.js');
const path = require('path');
const bodyParser = require('body-parser')
const { QueryTypes } = require('sequelize');
const sequelize = require('./database/index.js');
const cors = require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '../client/public/dist')))


// getting all products data from DB
app.get('/products', async (req, res) => {
    try {
      const data = await db.Product.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']}
      })
      res.send(data);
    } catch (e) {
    console.error(e);
    }
})


 // getting a specific product's data from the DB
app.get('/products/:productId', async (req, res) => {
  const data = await db.Product.findAll({
    where: {
      id: req.params.productId
    },
    attributes: {exclude: ['createdAt', 'updatedAt']}
  })
    res.send(data[0]);
  })


// get all available stock using raw SQL query with inner joins
app.get('/stock', async (req, res) => {
  try {

  const stocks = await sequelize.query("\
  SELECT Stocks.id, Products.name, Stores.location, Stocks.color, \
  Stocks.size, Stocks.qty, Products.id as productId \
  FROM Stocks INNER JOIN Stores ON Stores.id = Stocks.storeId \
  INNER JOIN Products ON Stocks.productId = Products.id",
  {type: QueryTypes.SELECT});

    await res.send(stocks);
  } catch (e) {
    console.log(e);
  }

  })


  // get a specific product's stock using raw SQL query with inner joins
app.get('/stock/:productId', async (req, res) => {

  const stocks = await sequelize.query(`\
  SELECT Stocks.id, Products.name, Stores.location, Stocks.color, \
  Stocks.colorUrl, Stocks.size, Stocks.qty, Products.id as productId, Stores.id as storeId \
  FROM Stocks INNER JOIN Stores ON Stores.id = Stocks.storeId \
  INNER JOIN Products ON Stocks.productId = Products.id \
  WHERE Stocks.productId = ${[req.params.productId]}`,
  {type: QueryTypes.SELECT});

    await res.send(stocks);
});

  // getting all Stores data from DB
app.get('/stores', async (req, res) => {
  const data = await db.Store.findAll({
    attributes: {exclude: ['createdAt', 'updatedAt']}
  })
    res.send(data);
  })

  // get a store's data
app.get('/stores/:storeId', async (req, res) => {
  const data = await db.Store.findAll({
    where: {
      id: req.params.storeId
    },
    attributes: {exclude: ['createdAt', 'updatedAt']}
  })
    res.send(data[0]);
  })



  // ------------------ getting stock data using sequelize methods ----------------
  // app.get('/stock', async (req, res) => {
  //     const data = await db.Stock.findAll({
  //   attributes: {exclude: ['createdAt', 'updatedAt']},
  //   include: [{
  //     model: db.Store,
  //     attributes: {exclude: ['createdAt', 'updatedAt']},
  //     required: false,
  //   }, {
  //         model: db.Product,
  //         attributes: {exclude: ['createdAt', 'updatedAt']},
  //         require: false
  //       }]
  // })
  //     await res.send(data);
  //   })



//Note: For practice, I'm doing all the Product operations with Async/Await, all the Store operations with Promises, and all the Stock operations with raw SQL.

//Post a new product using async/await
  app.post('/products', async (req, res) => {
    try {
      await db.Product.create(req.body);
      res.send('Product successfully added!');
    } catch (error) {
      console.error(error);
      res.send('There was an error adding a product');
    }
  });

//Post a new store using Promises
  app.post('/stores', (req, res) => {
    db.Store.create(req.body)
      .then((data) => {
        res.send('Store successfully added!');
      })
      .catch((error) => {
        console.error(error);
        res.send('There was an error adding a store');
      });
  });

//Post new stock info using raw SQL
app.post('/stock', (req, res) => {
  const { id, name, color, colorUrl, size, qty, productId, storeId } = req.body;
  sequelize.query(`INSERT INTO Stocks (id, color, colorUrl, size, qty, productId, storeId) values (${id}, '${color}', '${colorUrl}', '${size}', ${qty}, ${productId}, ${storeId})`,
    {type: QueryTypes.INSERT, attributes: {exclude: ['createdAt', 'updatedAt']}})
    .then((data) => {
      res.send('Stock successfully added!');
    })
    .catch((error) => {
      console.error(error);
      res.send('There was an error adding a stock');
    });
 });


//Update a new product using async/await
//Update a new store using Promises
//Post new stock info using raw SQL

//Delete one product using async/await
//Delete one store using Promises
//Delete one set of stock info using raw SQL

//Delete all products using async/await
//Delete all stores using Promises
//Delete all stock info using raw SQL


  app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
  });
