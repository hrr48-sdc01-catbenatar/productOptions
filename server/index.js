const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
  throw result.error
}

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

app.get('/products', async (req, res) => {
  try {
    const data = await db.Product.findAll();
    if (data === null) {
      res.status(404);
      res.send('Not found');
    } else {
      res.status(200);
      res.send(data);
    };
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send(`There was an error: ${e}`);
  }
});


 // getting a specific product's data from the DB
app.get('/products/:productId', async (req, res) => {
  try {
    const data = await db.Product.findOne({
      where: {
        id: req.params.productId
      }
    })
    if (data === null) {
      res.status(404);
      res.send('Not found');
    } else {
      res.status(200);
      res.send(data);
    };
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send(`There was an error: ${e}`);
  }
});


// get all available stock using raw SQL query with inner joins
// app.get('/stock', async (req, res) => {
//   try {
//     const data = await sequelize.query("\
//     SELECT Stocks.id, Products.name, Stores.location, Stocks.color, \
//     Stocks.size, Stocks.qty, Products.id as productId \
//     FROM Stocks INNER JOIN Stores ON Stores.id = Stocks.storeId \
//     INNER JOIN Products ON Stocks.productId = Products.id");
//     if (data === null) {
//       res.status(404);
//       res.send('Not found');
//     } else {
//       res.status(200);
//       res.send(data);
//     };
//   } catch (e) {
//     console.error(e);
//     res.status(500);
//     res.send(`There was an error: ${e}`);
//   }
// });


//   // get a specific product's stock using raw SQL query with inner joins
// app.get('/stock/:productId', async (req, res) => {
//   try {
//     const data = await sequelize.query(`\
//     SELECT Stocks.id, Products.name, Stores.location, Stocks.color, \
//     Stocks.colorUrl, Stocks.size, Stocks.qty, Products.id as productId, Stores.id as storeId \
//     FROM Stocks INNER JOIN Stores ON Stores.id = Stocks.storeId \
//     INNER JOIN Products ON Stocks.productId = Products.id \
//     WHERE Stocks.productId = ${[req.params.productId]}`);
//     if (data[0][0] === null) {
//       res.status(404);
//       res.send('Not found');
//     } else {
//       res.status(200);
//       res.send(data[0][0]);
//     };
//   } catch (e) {
//     console.error(e);
//     res.status(500);
//     res.send(`There was an error: ${e}`);
//   }
// });

// //get a specific stock using the stock's own id
// app.get('/stockId/:stockId', async (req, res) => {
//   try {
//     const data = await sequelize.query(`\
//     SELECT id, color, colorUrl, size, qty, productId, storeId FROM Stocks WHERE id = ${[req.params.stockId]}`);
//     if (data[0][0] === null) {
//       res.status(404);
//       res.send('Not found');
//     } else {
//       res.status(200);
//       res.send(data[0][0]);
//     };
//   } catch (e) {
//     console.error(e);
//     res.status(500);
//     res.send(`There was an error: ${e}`);
//   }
// });

//   // getting all Stores' data from DB
// app.get('/stores', async (req, res) => {
//   try {
//     const data = await db.Store.findAll();
//     if (data === null) {
//       res.status(404);
//       res.send('Not found');
//     } else {
//       res.status(200);
//       res.send(data);
//     }
//   } catch (e) {
//     console.error(e);
//     res.status(500);
//     res.send(`There was an error: ${e}`);
//   }
// });

//   // get a store's data
// app.get('/stores/:storeId', async (req, res) => {
//   try {
//     const data = await db.Store.findOne({
//       where: {
//         id: req.params.storeId
//       }
//     });
//     if (data === null) {
//       res.status(404);
//       res.send('Not found');
//     } else {
//       res.status(200);
//       res.send(data);
//     }

//   } catch (e) {
//     console.error(e);
//     res.status(500);
//     res.send(`There was an error: ${e}`);
//   }
// });

//USE SEQUELIZE EAGER LOADING FOR STOCKS

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



app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
});