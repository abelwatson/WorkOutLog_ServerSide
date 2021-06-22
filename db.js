const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:7c44d5e9e95a4e759102586813474d4f@localhost:5432/WOL");

module.exports = sequelize;