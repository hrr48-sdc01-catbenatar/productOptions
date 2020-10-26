const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  throw result.error
}

require('newrelic');

const express = require('express');
const db = require('./database');
const app = express();

const path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '../client/public/dist')))

app.get('/products', (req, res) => {
  db.getAllProducts((err, data) => {
    if(err) {
      res.status(404).send('Not found');
    } else {
      res.send(data.rows);
    }
  });
});

app.get('/products/:productId', (req, res) => {
  const productId = req.params.productId;
  db.getOneProduct(productId, (err, data) => {
    if(err) {
      res.status(404).send('Not found');
    } else {
      res.send(data.rows[0]);
    }
  });
});


app.get('/stock', (req, res) => {
  db.getAllStocks((err, data) => {
    if(err) {
      res.status(404).send('Not found');
    } else {
      res.send(data.rows);
    }
  });
});

app.get('/stock/:productId', (req, res) => {
  const productId = req.params.productId;
  db.getStocksByProductId(productId, (err, data) => {
    if(err) {
      res.status(404).send('Not found');
    } else {
      res.send(data.rows);
    }
  });
});

app.get('/stores', (req, res) => {
  db.getAllStores((err, data) => {
    if(err) {
      res.status(404).send('Not found');
    } else {
      res.send(data.rows);
    }
  });

});

app.get('/stores/:storeId', (req, res) => {
  const storeId = req.params.storeId;
  db.getOneStore(storeId, (err, data) => {
    if(err) {
      res.status(404).send('Not found');
    } else {
      res.send(data.rows[0]);
    }
  });
});

app.post('/stores', (req, res) => {
  db.addStore(req.body, (err, data) => {
    if(err) {
      res.status(404).send('Error with post');
    } else {
      res.send('Success!');
    }
  });
});

app.post('/products', (req, res) => {
  db.addProduct(req.body, (err, data) => {
    if(err) {
      res.status(404).send('Error with post');
    } else {
      res.send('Success!');
    }
  });
});

app.post('/stock', (req, res) => {
  db.addStock(req.body, (err, data) => {
    if(err) {
      res.status(404).send('Error with post');
    } else {
      res.send('Success!');
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log(`app listening at http://localhost:${process.env.PORT}`);
});