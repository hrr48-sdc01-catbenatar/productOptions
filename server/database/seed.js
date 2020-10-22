const csvParser = require('csv-parser');
const fs = require('fs');
const {Product, Stock, Store} = require('./models.js');


//drop database options if it exists
//create database options
//seed the three tables straight from csv.

const productsPath = './products.csv';
const stocksPath = './stocks.csv';
const storesPath = './stores.csv';

// fs.createReadStream(productsPath)
//     .on('error', () => {
//         // handle error
//     })

//     .pipe(csvParser())
//     .on('data', (row) => {
//         // use row data
//     })

//     .on('end', () => {
//         // handle end of CSV
//     })