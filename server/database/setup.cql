DROP TABLE IF EXISTS options.products;
DROP TABLE IF EXISTS options.stores;
DROP TABLE IF EXISTS options.stocks_by_product_id;

CREATE TABLE IF NOT EXISTS products (
    id int PRIMARY KEY,
    name text,
    price float,
    reviews float,
    reviewCount int);

CREATE TABLE IF NOT EXISTS stores (id int PRIMARY KEY,location text);

CREATE TABLE IF NOT EXISTS stocks_by_product_id (
    id int,
    name text,
    location text,
    color text,
    colorUrl text,
    size text,
    qty int,
    ProductId int,
    StoreId int,
    PRIMARY KEY (ProductId, id));