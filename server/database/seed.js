// destructuring models into the specific tables
const {Product, Stock, Store} = require('./models.js');
const faker = require('faker');























// asynchronous anonymous function to populate the database
(async function() {

  /*
    to wipe and replace all data:
    1) run in Mysql terminal:
    SET FOREIGN_KEY_CHECKS = 0;
    TRUNCATE TABLE stocks;TRUNCATE TABLE products;TRUNCATE TABLE stores;
    2) run:
    node database/seed.jsnp
  */

// ------------------------- actual data -------------------------:
  var stores = ['boulder', 'longmont', 'superior', 'westminister', 'aurora'];
  var products = [
  `Men's Standard Fit French Terry Hoodie Sweatshirt - Goodfellow & Co™`,
  `Men's Standard Fit Hoodie Sweatshirt - Goodfellow & Co™`,
  `Hanes Men's Ultimate Cotton Sweatshirt`,
  `Hanes Men's EcoSmart Fleece Pullover Hooded Sweatshirt`,
  `Men's Regular Fit Fleece Pullover Hoodie - Goodfellow & Co™ Black`,
  `Hanes Men's Ultimate Cotton Pullover Hooded Sweatshirt`
  ];
  // can make colors an array of arrays, each one having colors for the
  // corresponding product from the outer product loop
  var colors = [
    ['White', 'https://imgur.com/xvJ98fe.png'],
    ['Blue', 'https://imgur.com/zReIoca.png'],
    ['Green', 'https://imgur.com/SRGlFjx.png'],
    ['Peach', 'https://imgur.com/6dpqKHe.png'],
    ['Red', 'https://imgur.com/y81ZoDc.png'],
    ['Gold', 'https://imgur.com/L7cseNz.png']
  ];
  var sizes = ['S', 'M', 'L', 'XL', 'XXL', '2XL'];


  try {
    for (var st = 0; st < stores.length; st++) {
      var newStore = await Store.findOne({ where: {location: stores[st]} });
      // only create the store if it doesn't exist in the table (avoid making duplicates)
      if (newStore === null) {
        newStore = await Store.create({
          location: stores[st]
        });
      }

      for (var p = 0; p < products.length; p++) {
      // price between 10$ - 20$
      var price = Math.ceil(Math.random() * 10) + 10 - 0.01;
      // reviews average between 2-5 stars
      var reviewsAvg = parseFloat(((Math.random() * 3) + 2).toFixed(2))
      // review counts between 0-135
      var reviewCount = Math.floor(Math.random() * 135);

      var newProduct = await Product.findOne({ where: {name: products[p]} });

      // only create the product if it doesn't exist in the table (avoid making duplicates)
      if (newProduct === null) {
        newProduct = await Product.create({
          name: products[p],
          price: price,
          reviews: reviewsAvg,
          reviewCount: reviewCount
        });
      }

          // loop over colors
        for (var c = 0; c < colors.length; c++) {
          // loop over sizes
          for (var s = 0; s < sizes.length; s++) {

            // add product with random quantity
            var quantity = Math.floor(Math.random() * 5);
            // out of stock for all sizes for these two colors
            if (colors[c][0] === 'Green' || colors[c][0] === 'Red'){
            quantity = 0;
            }
            const newStock = await Stock.create({
              color: colors[c][0],
              colorUrl: colors[c][1],
              size: sizes[s],
              qty: quantity
              // set the relationships between stock/store and stock/product
            });
            await newStock.setStore(newStore);
            await newStock.setProduct(newProduct);
          }
        }
      }
  }



    // // ------------------------- faker data -------------------------:
    // adjust max st to change number of fake stores
    for (var st = 0; st < stores.length; st++) {
      var fakeStore = await Store.findOne({ where: {location: stores[st]} });
      // adjust max p to change number of products
      for (var p = 0; p < 10; p++) {
        const fakeProduct = await Product.create({
        name: faker.commerce.product(),
        price: (faker.commerce.price() % 40 + 10),
        reviews: parseFloat(((Math.random() * 2) + 3).toFixed(2)),
        reviewCount: Math.floor(Math.random() * 35)
        })

        // var numOfColors = Math.ceil(Math.random() * 5);
        for (var c = 0; c < colors.length; c++) {
        // using the same sizes array used at the top
          for (var s = 0; s < sizes.length; s++) {

            var quantity = Math.floor(Math.random() * 5);
            const fakeStock = await Stock.create({
              color: colors[c][0],
              colorUrl: colors[c][1],
              size: sizes[s],
              qty: quantity
            })
            await fakeStock.setStore(fakeStore);
            await fakeStock.setProduct(fakeProduct);
          }
        }
      }
    }
  } catch (e) {
    console.log(e);
  }

})();
