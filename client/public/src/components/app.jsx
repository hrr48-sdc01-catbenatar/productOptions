import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import Details from './details.jsx';
import SelectQty from './selectQty.jsx'
import Options from './options.jsx';
import Store from './store.jsx';
import {ProductOptionsStyling, Flexbox, Column} from '../styling/styles.jsx';

const ProductOptions = () => {
  const urlProductId = window.location.pathname.slice(1) || 1;
  const [stores, setStores] = useState([]);
  const [stock, setStock] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [store, setStore] = useState({id: 1});
  const [product, setProduct] = useState({id: urlProductId});
  const [color, setColor] = useState('White');
  const [size, setSize] = useState('M');
  const [qty, setQty] = useState(0);
  const [stockQtys, setStockQtys] = useState({});

  const [buyQty, setBuyQty] = useState(1);
  const [cart, setCart] = useState(0);

  // get the products general details such as price, name and reviews
  const getProduct = async (productId) => {
    const response = await axios.get(`http://localhost:3002/products/${productId}`);
    const productData = response.data;
    setProduct(productData);
  }

  // get a store's id and location
  const getStore = async (storeId) => {
    const response = await axios.get(`http://localhost:3002/stores/${storeId}`);
    const storeData = response.data;
    setStore(storeData);
  }

  // get a list of all the stores (names and ids)
  const getStores = async () => {
    const response = await axios.get(`http://localhost:3002/stores`);
    const storesData = response.data;
    setStores(storesData);
  }

  // get all available stock for the selected item in the selected store
  const getStock = async (productId) => {
    const response = await axios.get(`http://localhost:3002/stock/${productId}`);
    const stockData = response.data;
    // filter to only have the selected store's stock for the selected product
    const productStock = stockData.filter(item => item.location === store.location);
    setStock(productStock);
    }

    // extract colors and sizes options from the product stock
  const getColorsAndSizes = () => {
    var colorsTracker = {};
    var colors = [];
    var stockTotals = {};
    stockTotals.total = 0;

    var sizes = {};

    stock.forEach( item => {
      // in one iteration, adding the colors, and quantities for each size/color
      if ( !colorsTracker[item.color] ) {
        colorsTracker[item.color] = true;
        colors.push([item.color, item.colorurl]);
        stockTotals[item.color] = {total: 0};
      }
      stockTotals[item.color].total += item.qty;
      stockTotals.total += item.qty;

      if (stockTotals[item.color][item.size] === undefined) {
        stockTotals[item.color][item.size] = item.qty;
      } else {
        stockTotals[item.color][item.size] += item.qty;
      }

      if ( !sizes[item.size] ) { sizes[item.size] = true }
    });

    setStockQtys(stockTotals);
    setColors(colors);

    // extracting as an array
    setSizes(Object.keys(sizes));
  }

  const setActiveColor = (color) => {
    setColor(color);
  }

  const setActiveSize = (size) => {
    setSize(size);
  }

  const addToShopCart = (qty) => {
    setCart(qty);
  }

  const getQty = () => {
    for (var product of stock) {
      if (product.color === color && product.size === size) {
         setQty(product.qty);
      }
     }
  }

  const handleBuyQtyChange = (number) => {
    setBuyQty(number);
  }

  useEffect( () => {
    getProduct(product.id);
    getStore(store.id);
    getStores();
    getStock(product.id);
    getColorsAndSizes();
    getQty();
    // passing in this array as a second parameter re-renders only if one of the elements change
  }, [store.location, stock.length, size, color])

    return (
      <ProductOptionsStyling>
        <Flexbox>
          <Column>
            <Details product={product} />
            <SelectQty buyQty={buyQty} handleBuyQtyChange={handleBuyQtyChange}/>
            <Options colors={colors} sizes={sizes} setActiveColor={setActiveColor} setActiveSize={setActiveSize} activeColor={color} activeSize={size} qty={stockQtys}/>
          </Column>

          <Column>
            <Store store={store} qty={qty} buyQty={buyQty} addToShopCart={addToShopCart}/>
          </Column>
        </Flexbox>
      </ProductOptionsStyling>
    )
}

export default ProductOptions;