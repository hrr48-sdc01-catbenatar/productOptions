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
    const data = await db.Product.findAll();
    res.send(data);
  } catch (e) {
  console.error(e);
  }
});


 // getting a specific product's data from the DB
app.get('/products/:productId', async (req, res) => {
  try {
    const data = await db.Product.findAll({
      where: {
        id: req.params.productId
      }
    })
    res.send(data[0]);
  } catch (e) {
    console.error(e);
  }
});


// get all available stock using raw SQL query with inner joins
app.get('/stock', async (req, res) => {
  try {
    const stocks = await sequelize.query("\
    SELECT Stocks.id, Products.name, Stores.location, Stocks.color, \
    Stocks.size, Stocks.qty, Products.id as productId \
    FROM Stocks INNER JOIN Stores ON Stores.id = Stocks.storeId \
    INNER JOIN Products ON Stocks.productId = Products.id");
    res.send(stocks);
  } catch (e) {
    console.log(e);
  }
});


  // get a specific product's stock using raw SQL query with inner joins
app.get('/stock/:productId', async (req, res) => {
  try {
    const stocks = await sequelize.query(`\
    SELECT Stocks.id, Products.name, Stores.location, Stocks.color, \
    Stocks.colorUrl, Stocks.size, Stocks.qty, Products.id as productId, Stores.id as storeId \
    FROM Stocks INNER JOIN Stores ON Stores.id = Stocks.storeId \
    INNER JOIN Products ON Stocks.productId = Products.id \
    WHERE Stocks.productId = ${[req.params.productId]}`);
    res.send(stocks);
  } catch (e) {
    console.error(e);
  }
});

//get a specific stock using the stock's own id
app.get('/stockId/:stockId', async (req, res) => {
  try {
    const stocks = await sequelize.query(`\
    SELECT * FROM Stocks WHERE Stocks.id = ${[req.params.stockId]}`);
    res.send(stocks);
  } catch (e) {
    console.error(e);
  }
});

  // getting all Stores' data from DB
app.get('/stores', async (req, res) => {
  try {
    const data = await db.Store.findAll();
    res.send(data);
  } catch (e) {
    console.error(e);
  }
});

  // get a store's data
app.get('/stores/:storeId', async (req, res) => {
  try {
    const data = await db.Store.findAll({
      where: {
        id: req.params.storeId
      }
    });
    res.send(data[0]);
  } catch (e) {
    console.error(e);
  }
});



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
    } catch (e) {
      console.error(e);
      res.send('There was an error adding a product');
    }
  });

//Post a new store using Promises
  app.post('/stores', (req, res) => {
    db.Store.create(req.body)
      .then((data) => {
        res.send('Store successfully added!');
      })
      .catch((e) => {
        console.error(e);
        res.send('There was an error adding a store');
      });
  });

//Post new stock info using raw SQL
app.post('/stock', (req, res) => {
  const { id, name, color, colorUrl, size, qty, productId, storeId } = req.body;
  sequelize.query(`INSERT INTO Stocks (color, colorUrl, size, qty, productId, storeId) values ('${color}', '${colorUrl}', '${size}', ${qty}, ${productId}, ${storeId})`)
    .then((data) => {
      res.send('Stock successfully added!');
    })
    .catch((e) => {
      console.error(e);
      res.send('There was an error adding a stock');
    });
 });


//Update a product using async/await
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.Product.update(req.body, {
      where: {
        id: id
      }
    });
    res.send(`Product ${id} successfully updated`);
  } catch(e) {
    console.error(e);
    res.send(`There was an error updating product ${id}`);
  }
});

//Update a store using Promises
app.put('/stores/:id', (req, res) => {
  const { id } = req.params;
  db.Store.update(req.body, {
    where: {
      id: id
    }
  })
    .then( (data) => {
      res.send(`Store ${id} successfully updated`);
    })
    .catch( (e) => {
      console.error(e);
      res.send(`There was an error updating product ${id}`);
    });
});

//Update stock info using raw SQL
app.put('/stock/:id', (req, res) => {
  const { id } = req.params;
  const { color, colorUrl, size, qty, storeId, productId } = req.body
  sequelize.query(`UPDATE Stocks SET color='${color}', colorUrl='${colorUrl}', size='${size}', qty=${qty}, storeId=${storeId}, productId=${productId} WHERE id=${id}`)
    .then((data) => {
      res.send(`Stock ${id} successfully updated`);
    })
    .catch( (e) => {
      console.error(e);
      res.send(`There was an error updating stock ${id}`);
    });
})

//Delete one product using async/await
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.Product.destroy({
      where: {
        id: id
      }
    });
    res.send(`Product ${id} successfully deleted`);
  } catch (e) {
    console.error(e);
    res.send(`There was an error deleting product ${id}`);
  }
})

//Delete one store using Promises
app.delete('/stores/:id', (req, res) => {
  const { id } = req.params;
  db.Store.destroy({
    where: {
      id: id
    }
  })
    .then ((data) => {
      res.send(`Store ${id} successfully deleted`);
    })
    .catch ((e) => {
      console.error(e);
      res.send(`There was an error deleting store ${id}`);
    });
})

//Delete one set of stock info using raw SQL
app.delete('/stock/:id', (req, res) => {
  const { id } = req.params;
  sequelize.query(`DELETE FROM Stocks WHERE id=${id}`)
    .then((data) => {
      res.send(`Stock ${id} successfully deleted`);
    })
    .catch ((e) => {
      console.error(e);
      res.send(`There was an error deleting stock ${id}`);
    });
})

//Delete all products using async/await
//Delete all stores using Promises
//Delete all stock info using raw SQL


  app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
  });
