console.time('productTimer');
console.time('storeTimer');
console.time('stockTimer');
console.time('stockByProductIdTimer');

const faker = require('faker');
const fs = require('fs');

const writeProducts = fs.createWriteStream('products.csv');
const writeStores = fs.createWriteStream('stores.csv');
const writeStocks = fs.createWriteStream('stocks.csv');
//cassandra
const writeStocksByProductId = fs.createWriteStream('stocks_by_product_id.csv');

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
const locations = ['boulder', 'longmont', 'superior', 'westminister', 'aurora', 'nyc'];

const productChunkSize = 1000;
const storeChunkSize = locations.length;
const stockChunkSize = 1000;

//using 1 million for totalProductRecords, which corresponds with 216 million stock records
const totalProductRecords = 10000;
const totalStoreRecords = locations.length;
const totalStockRecords = totalProductRecords * totalStoreRecords * colors.length * sizes.length;

//generic function that writes data for any of the three tables--Products, Stocks, or Stores
const writeData = function(writer, totalRecords, chunkSize, headers, generateFunction, encoding, callback) {
  let i = totalRecords / chunkSize;
  write();
  function write() {
    let ok = true;
    try {
      do {
        let data = '';
        if (i === totalRecords / chunkSize) {
          data += headers;
        }
        data += generateFunction(chunkSize);
        i--;
        if (i === 0) {
          writer.write(data, encoding, callback);
        } else {
          ok = writer.write(data, encoding);
        }
      } while (i > 0 && ok);
      if (i > 0) {
        writer.once('drain', write);
      }
    } catch(e) {
      console.error(e);
    }
  }
}

let productId = 0;
const productDataHeaders = `id,name,price,reviews,reviewcount`;
const makeRandomProducts = function(num) {
  let productData = '\n';
  const limit = Math.min(productId + num, totalProductRecords);
  while (productId < limit) {
    const name = faker.commerce.product();
    const price = faker.commerce.price();
    const reviews = parseFloat(((Math.random() * 2) + 3).toFixed(2));
    const reviewCount = Math.floor(Math.random() * 35);
    productData += `${productId},"${name}",${price},${reviews},${reviewCount}\n`;
    productId++;
  }
  return productData.slice(0, -1);
}

let storeId = 0;
const storeDataHeaders = `id,location`;
const makeStores = function(num) {
  let storeData = '\n';
  const limit = storeId + num;
  while (storeId < limit) {
    const location = locations[storeId];
    storeData += `${storeId},"${location}"\n`;
    storeId++;
  }
  return storeData.slice(0, -1);
}

let stockId = 0;
let stock_productId = 0;
let stock_storeId = 0;
const stockDataHeaders = `id,color,colorUrl,size,qty,StoreId,ProductId`;

const makeRandomStocks = function(num) {
  const limit = Math.min(stockId + num, totalStockRecords);
  let stockData = '\n';
  while (stockId < limit) {
    //create a stock for each combination of color and size for a single storeId and a single productId
    for (var colorIndex = 0; colorIndex < colors.length; colorIndex++) {
      for (var sizeIndex = 0; sizeIndex < sizes.length; sizeIndex++) {
        const color = colors[colorIndex][0];
        const colorUrl = colors[colorIndex][1];
        const size = sizes[sizeIndex];
        const qty = Math.floor(Math.random() * 15);
        stockData += `${stockId},"${color}","${colorUrl}","${size}",${qty},${stock_storeId},${stock_productId}\n`;
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
  return stockData.slice(0, -1);
}

writeData(writeProducts, totalProductRecords, productChunkSize, productDataHeaders, makeRandomProducts, 'utf-8', (e, data) => {
  writeProducts.removeAllListeners('drain');
  writeProducts.end();
  console.timeEnd('productTimer');
  if(e) {
    console.error(e)
  }
});

writeData(writeStores, totalStoreRecords, storeChunkSize, storeDataHeaders, makeStores, 'utf-8', (e, data) => {
  writeStores.removeAllListeners('drain');
  writeStores.end();
  console.timeEnd('storeTimer');
  if(e) {
    console.error(e)
  }
});

writeData(writeStocks, totalStockRecords, stockChunkSize, stockDataHeaders, makeRandomStocks, 'utf-8', (e, data) => {
  writeStocks.removeAllListeners('drain');
  writeStocks.end();
  console.timeEnd('stockTimer');
  if(e) {
    console.error(e)
  }
});


//CASSANDRA DATA GEN...for benchmarking purposes, it's ok that products in product table and products in stocks_by_product_id will have different random data.

let cass_stockId = 0;
let cass_productId = 0;
let cass_storeId = 0;
let cass_name = faker.commerce.product();
const stockByProductDataHeaders = `id,name,location,color,colorurl,size,qty,storeid,productid`;

const makeStocksByProductId = function(num) {
  const limit = Math.min(cass_stockId + num, totalStockRecords);
  let stockData = '\n';
  while (cass_stockId < limit) {
    //create a stock for each combination of color and size for a single storeId and a single productId
    for (var colorIndex = 0; colorIndex < colors.length; colorIndex++) {
      for (var sizeIndex = 0; sizeIndex < sizes.length; sizeIndex++) {
        const color = colors[colorIndex][0];
        const colorUrl = colors[colorIndex][1];
        const size = sizes[sizeIndex];
        const qty = Math.floor(Math.random() * 15);
        const location = locations[cass_storeId];
        stockData += `${cass_stockId},"${cass_name}","${location}","${color}","${colorUrl}","${size}",${qty},${cass_storeId},${cass_productId}\n`;
        cass_stockId++;
      }
    }
    //Generate stock for all stores for first product. Then all stores for second product. etc.
    if (cass_storeId >= locations.length - 1) {
      cass_storeId = 0;
      cass_productId++;
      cass_name = faker.commerce.product();
    } else {
      cass_storeId++;
    }
  }
  return stockData.slice(0, -1);
}

writeData(writeStocksByProductId, totalStockRecords, stockChunkSize, stockByProductDataHeaders, makeStocksByProductId, 'utf-8', (e, data) => {
  writeStocksByProductId.removeAllListeners('drain');
  writeStocksByProductId.end();
  console.timeEnd('stockByProductIdTimer');
  if(e) {
    console.error(e)
  }
});