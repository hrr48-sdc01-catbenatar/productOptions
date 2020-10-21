console.time('productTimer');
console.time('storeTimer');
console.time('stockTimer');

const faker = require('faker');
const fs = require('fs');

const productChunkSize = 1000;
const storeChunkSize = 5;
const stockChunkSize = 1000;

const writeProducts = fs.createWriteStream('products.csv');
const writeStores = fs.createWriteStream('stores.csv');
const writeStocks = fs.createWriteStream('stocks.csv');

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

//using 1 million for totalProductRecords, which corresponds with 180 million stock records
const totalProductRecords = 1000000;
const totalStoreRecords = locations.length;
const totalStockRecords = totalProductRecords * totalStoreRecords * colors.length * sizes.length;

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

let productId = 0;
const makeRandomProducts = function(num) {
  let productData = '';
  const limit = Math.min(productId + num, totalProductRecords);
  while (productId < limit) {
    const name = faker.commerce.product();
    const price = (faker.commerce.price() % 40 + 10);
    const reviews = parseFloat(((Math.random() * 2) + 3).toFixed(2));
    const reviewCount = Math.floor(Math.random() * 35);
    productData += `${productId},${name},${price},${reviews},${reviewCount}\n`;
    productId++;
  }
  return productData;
}

let storeId = 0;
const makeStores = function(num) {
  let storeData = '';
  const limit = storeId + num;
  while (storeId < limit) {
    const location = locations[storeId];
    storeData += `${storeId},${location}\n`;
    storeId++;
  }
  return storeData;
}

let stockId = 0;
let stock_productId = 0;
let stock_storeId = 0;

const makeRandomStocks = function(num) {
  let stockData = '';
  const limit = Math.min(stockId + num, totalStockRecords);
  while (stockId < limit) {
    //create a stock for each combination of color and size for a single storeId and a single productId
    for (var colorIndex = 0; colorIndex < colors.length; colorIndex++) {
      for (var sizeIndex = 0; sizeIndex < sizes.length; sizeIndex++) {
        const color = colors[colorIndex][0];
        const colorUrl = colors[colorIndex][1];
        const size = sizes[sizeIndex];
        const qty = Math.floor(Math.random() * 15);
        const storeId = stock_storeId;
        const productId = stock_productId;
        stockData += `${stockId},${color},${colorUrl},${size},${qty},${storeId},${productId}\n`;
        stockId++;
      }
    }
    //Generate stock for all stores for first product. Then all stores for second product. etc.
    if (stock_storeId >= locations.length - 1) {
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
  console.timeEnd('productTimer');
  if(e) {
    console.error(e)
  }
});

writeData(writeStores, totalStoreRecords, storeChunkSize, makeStores, 'utf-8', (e, data) => {
  writeStores.removeAllListeners('drain');
  writeStores.end();
  console.timeEnd('storeTimer');
  if(e) {
    console.error(e)
  }
});

writeData(writeStocks, totalStockRecords, stockChunkSize, makeRandomStocks, 'utf-8', (e, data) => {
  writeStocks.removeAllListeners('drain');
  writeStocks.end();
  console.timeEnd('stockTimer');
  if(e) {
    console.error(e)
  }
});