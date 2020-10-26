const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: [`localhost:9042`], localDataCenter: 'datacenter1', keyspace: 'options' });

module.exports.getOneProduct = (productId, callback) => {
  const query = `SELECT * FROM products WHERE id = ${productId}`;
  updateDatabase(query, callback);
}

module.exports.getAllProducts = (callback) => {
  const query = `SELECT * FROM products`;
  updateDatabase(query, callback);
}

module.exports.getOneStore = (storeId, callback) => {
  const query = `SELECT * FROM stores WHERE id=${storeId}`;
  updateDatabase(query, callback);
}

module.exports.getAllStores = (callback) => {
  const query = `SELECT * FROM stores`;
  updateDatabase(query, callback);
}

module.exports.getAllStocks = (callback) => {
  const query = `SELECT * FROM stocks_by_product_id`;
  updateDatabase(query, callback);
}

module.exports.getStocksByProductId = (productId, callback) => {
  const query = `SELECT * FROM stocks_by_product_id WHERE productid =${productId}`;
  updateDatabase(query, callback);
}

//POST REQUESTS
module.exports.addProduct = (obj, callback) => {
  const {id, name, price, reviewcount, reviews} = obj;
  const query = `INSERT INTO options.products (id, name, price, reviewcount, reviews)
  VALUES (${id}, '${name}', ${price}, ${reviewcount}, ${reviews}) `;
  updateDatabase(query, callback);
}

module.exports.addStore = (obj, callback) => {
  const {id, location} = obj;
  const query = `INSERT INTO options.stores (id, location)
  VALUES (${id}, '${location}') `;
  updateDatabase(query, callback);
}

module.exports.addStock = (obj, callback) => {
  const {productid, id, color, colorurl, location, name, qty, size, storeid} = obj;
  const query = `INSERT INTO options.stocks_by_product_id (productid, id, color, colorurl, location, name, qty, size, storeid) VALUES (${productid}, ${id}, '${color}', '${colorurl}', '${location}', '${name}', ${qty}, '${size}', ${storeid}) `;
  updateDatabase(query, callback);
}

var updateDatabase = function(query, callback) {
  client.execute(query)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      console.error(err);
      callback(err);
    });
}


