const {Sequelize, DataTypes} = require('sequelize');
const dialects = ['mysql', 'postgres'];

const db = new Sequelize(
  'options', 'root', '', {
    host: '127.0.0.1',
    // can try port number
    port: 3307,
    dialect: 'mysql'
  });


  db.authenticate()
    .then((data) => {
      console.log('Connection has been established successfully.')
    })
    .catch((error) => {
      console.error('Unable to connect to the database:', error);
    });


module.exports = db;
