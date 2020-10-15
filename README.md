## Product options component

 Module to select quantity, color or size before adding an item to the registry.

#### Demo: (http://g.recordit.co/bhIaDImKTE.gif)

------

### Installation

#### Server:

Go into server folder

run  `npm install` to install dependencies

Start MySQL by running `mysql.server start`

Make sure to have MySQL installed then run `MySQL` then run the following in a MySQL terminal:

`CREATE DATABASE options;USE options;`

run `npm run seed`

If you get any errors or if at any other point you want to wipe and replace all data:

1. Run the following in your MySQL terminal:

`USE options;SET FOREIGN_KEY_CHECKS = 0;TRUNCATE TABLE Stocks;TRUNCATE TABLE Products;TRUNCATE TABLE Stores;`

2. Close out of MySQL and run `npm run seed` again.


#### Client:

Go into client folder

run  `npm install` to install dependencies
run `npm run build` to build the webpack bundle

### Data Schema
There are three tables: Products, Stores, and Stocks. There is a one-to-many relationship between Products and Stocks and between Stores and Stocks. The Stocks table has a productId foreign key as well as a storeId foreign key.

#### Products Table
name: String, allowNull: false
price: Float, allowNull: false
reviews: Float, defaultValue: 0
reviewCount: Integer, defaultValue: 0

#### Stores Table
location: String, allowNull: false

#### Stocks Table
color: String
colorUrl: String
size: String
qty: Integer, defaultValue: 0
storeId: Integer
productId: Integer

### Available CRUD Operations

`GET '/products'` returns all products in the Products table

`GET '/products/:productId'` returns the product specified in the url

`GET '/stock'` returns all available stocks

`GET '/stock/:productId'` returns all available stocks for the product specified in the url

`GET '/stockId/:stockId'` returns a specific stock using the stock's own id

`GET '/stores'` returns all stores in the Stores table

`GET '/stores/:storeId'` returns the store specified in the url

`POST '/products'` post a new product to the Products table

`POST '/stores'` post a new store to the Stores table

`POST '/stock'` post a new stock to the Stocks table

`PUT '/products/:id'` update the product specified in the url

`PUT '/stores/:id'` update the store specified in the url

`PUT '/stock/:id'` update the stock specified in the url

`DELETE '/products/:id'` delete the product specified in the url

`DELETE '/stores/:id'` delete the store specified in the url

`DELETE '/stock/:id'` delete the stock specified in the url
