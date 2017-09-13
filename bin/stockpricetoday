#! /app/.heroku/node/bin/node

var connection = require("./../connection");

connection.query("INSERT INTO stocks_prices (price, stock_symbol) (SELECT price, symbol FROM stocks)", function (err, result) {

});

console.log("PREÇOS ATUALIZADOS");