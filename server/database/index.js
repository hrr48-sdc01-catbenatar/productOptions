const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: [`localhost:9042`], localDataCenter: 'datacenter1', keyspace: 'options' });


module.exports.getOneProduct = (productId, callback) => {
  const query = `SELECT * FROM products WHERE id = ${productId}`;
  client.execute(query)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      console.error(err);
      callback(err);
    });
}

module.exports.getAllProducts = (callback) => {
  const query = `SELECT * FROM products`;
  client.execute(query)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      console.error(err);
      callback(err);
    });
}

module.exports.getOneStore = (storeId, callback) => {
  const query = `SELECT * FROM stores WHERE id=${storeId}`;
  client.execute(query)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      console.error(err);
      callback(err);
    });
}

module.exports.getAllStores = (callback) => {
  const query = `SELECT * FROM stores`;
  client.execute(query)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      console.error(err);
      callback(err);
    });
}

module.exports.getAllStocks = (callback) => {
  const query = `SELECT * FROM stocks_by_product_id`;
  client.execute(query)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      console.error(err);
      callback(err);
    });
}

module.exports.getStocksByProductId = (productId, callback) => {
  const query = `SELECT * FROM stocks_by_product_id WHERE productid =${productId}`;
  client.execute(query)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      console.error(err);
      callback(err);
    });
}

//POST REQUESTS
module.exports.addProduct = (obj, callback) => {
  const {id, name, price, reviewcount, reviews} = obj;
  const query = `INSERT INTO options.products (id, name, price, reviewcount, reviews)
  VALUES (${id}, '${name}', ${price}, ${reviewcount}, ${reviews}) `;
  client.execute(query)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      console.error(err);
      callback(err);
    });
}

module.exports.addStore = (obj, callback) => {
  const {id, location} = obj;
  const query = `INSERT INTO options.stores (id, location)
  VALUES (${id}, '${location}') `;
  client.execute(query)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      console.error(err);
      callback(err);
    });
}

module.exports.addStock = (obj, callback) => {
  const {productid, id, color, colorurl, location, name, qty, size, storeid} = obj;
  const query = `INSERT INTO options.stocks_by_product_id (productid, id, color, colorurl, location, name, qty, size, storeid) VALUES (${productid}, ${id}, '${color}', '${colorurl}', '${location}', '${name}', ${qty}, '${size}', ${storeid}) `;
  client.execute(query)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      console.error(err);
      callback(err);
    });
}