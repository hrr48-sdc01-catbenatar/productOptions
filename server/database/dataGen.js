const faker = require('faker');
const fs = require('fs');

const productChunkSize = 1000;
const storeChunkSize = 10;
const stockChunkSize = 1000;

const totalProductRecords = 10000000;
const totalStoreRecords = 50;
const totalStockRecords = totalProductRecords * totalStoreRecords;

const writeProducts = fs.createWriteStream('products.csv');
const writeStores = fs.createWriteStream('stores.csv');
const writeStocks = fs.createWriteStream('stocks.csv');

//starting values for the primary keys
let productId = 0;
let storeId = 0;
let stockId = 0;

//starting values for the foreign keys
let stock_productId = 0;
let stock_storeId = 0;

//data not available in the right format on Faker:
const colors = [
  ['White', 'https://imgur.com/xvJ98fe.png'],
  ['Blue', 'https://imgur.com/zReIoca.png'],
  ['Green', 'https://imgur.com/SRGlFjx.png'],
  ['Peach', 'https://imgur.com/6dpqKHe.png'],
  ['Red', 'https://imgur.com/y81ZoDc.png'],
  ['Gold', 'https://imgur.com/L7cseNz.png']
];
const sizes = ['S', 'M', 'L', 'XL', 'XXL', '2XL'];
const locations = ['boulder', 'longmont', 'superior', 'westminister', 'aurora'];

//generic function that writes data for any of the three tables--Products, Stocks, or Stores
const writeData = function(writer, totalRecords, chunkSize, generateFunction, encoding, callback) {
  let i = totalRecords / chunkSize;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      data = generateFunction(chunkSize)
      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write);
    }
  }
}


const makeRandomProducts = function(num) {
  let productData = '';
  const limit = productId + num;
  while (productId < limit) {
    const name = faker.commerce.product();
    const price = (faker.commerce.price() % 40 + 10);
    const reviews = parseFloat(((Math.random() * 2) + 3).toFixed(2));
    const reviewCount = Math.floor(Math.random() * 35);
    productData += `${productId}, ${name},${price}, ${reviews}, ${reviewCount}\n`;
    productId++;
  }
  return productData;
}


const makeRandomStores = function(num) {
  let storeData = '';
  const limit = storeId + num;
  while (storeId < limit) {
    const location = locations[Math.floor(Math.random() * locations.length)];
    storeData += `${storeId}, ${location}\n`;
    storeId++;
  }
  return storeData;
}


const makeRandomStocks = function(num) {
  let stockData = '';
  const limit = stockId + num;
  while (stockId < limit) {
    const colorIndex = Math.floor(Math.random() * colors.length);
    const color = colors[colorIndex][0];
    const colorUrl = colors[colorIndex][1];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const qty = Math.floor(Math.random() * 15);
    const storeId = stock_storeId;
    const productId = stock_productId;
    stockData += `${stockId}, ${color}, ${colorUrl}, ${size}, ${qty}, ${storeId}, ${productId}\n`;
    stockId++;

    //Generate stock for all stores for first product. Then all stores for second product. etc.
    if (stock_storeId >= totalStoreRecords - 1) {
      stock_storeId = 0;
      stock_productId++;
    } else {
      stock_storeId++;
    }
  }
  return stockData;
}

writeData(writeProducts, totalProductRecords, productChunkSize, makeRandomProducts, 'utf-8', (e, data) => {
  writeProducts.removeAllListeners('drain');
  writeProducts.end();
  if(e) {
    console.error(e)
  }
});

writeData(writeStores, totalStoreRecords, storeChunkSize, makeRandomStores, 'utf-8', (e, data) => {
  writeStores.removeAllListeners('drain');
  writeStores.end();
  if(e) {
    console.error(e)
  }
});

writeData(writeStocks, totalStockRecords, stockChunkSize, makeRandomStocks, 'utf-8', (e, data) => {
  writeStocks.removeAllListeners('drain');
  writeStocks.end();
  if(e) {
    console.error(e)
  }
});