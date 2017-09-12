/**
 * Created by MaiaVinicius on 25/07/17.
 */
var connection = require("./../connection");

module.exports.getAll = function (cb) {
    connection.query("select * from stocks where active = 1", function (err, result) {

        cb(result);
    });
};

module.exports.getAllWithPrices = function (cb) {
    connection.query("SELECT a.*, ((a.price * 100 / (SELECT z.price FROM stocks_prices z WHERE z.stock_symbol = a.symbol and DATE(z.date) = CURDATE() )) - 100)variation FROM stocks a\n" +
        "        LEFT JOIN stocks_prices b ON b.stock_symbol = a.symbol WHERE a.active = 1", function (err, result) {

        cb(result);
    });
};

module.exports.getStockPrice = function (stock, cb) {
    connection.query("SELECT price FROM stocks WHERE symbol = ?", [stock], function (err, result) {

        if (result) {
            result = result[0];
        }
        cb(result);
    });
};

module.exports.addPrice = function (stockSymbol, price) {
    //console.log(price)
    connection.query("UPDATE stocks SET price = ? WHERE symbol = ?", [price, stockSymbol], function (err, result) {
    });
};

module.exports.getTopFive = function (cb) {
  connection.query("SELECT a.*, ((a.price * 100 / (SELECT z.price FROM stocks_prices z WHERE z.stock_symbol = a.symbol and DATE(z.date) = CURDATE() )) - 100)variation FROM stocks a LEFT JOIN stocks_prices b ON b.stock_symbol = a.symbol WHERE a.active = 1 ORDER BY variation desc limit 5",  function (err, result) {
      cb(result);
  })
};

module.exports.getLeastFive = function (cb) {
    connection.query("SELECT a.*, ((a.price * 100 / (SELECT z.price FROM stocks_prices z WHERE z.stock_symbol = a.symbol and DATE(z.date) = CURDATE() )) - 100)variation FROM stocks a LEFT JOIN stocks_prices b ON b.stock_symbol = a.symbol WHERE a.active = 1 ORDER BY variation asc limit 5",  function (err, result) {
        cb(result);
    })
};

module.exports.addStock = function (userId, stockSymbol, stockPrice, stockQuantd, val) {
    connection.query("INSERT INTO operations (user_id, stock_symbol, price, qtd, buy_sell) " +
        "values (?,?,?,?,?)", [userId, stockSymbol, stockPrice, stockQuantd, val], function (err, result) {
        console.log(err);
    });
};


module.exports.getStocksWalletQtd = function (userId, cb) {
  connection.query("(SELECT stock_symbol, (SUM((qtd* -1)* buy_sell)) as quantidade, \n" +
      "(SELECT ((a.price * 100 / (SELECT z.price FROM stocks_prices z WHERE z.stock_symbol = a.symbol and DATE(z.date) = CURDATE() )) - 100)) as variation,\n" +
      "(SUM((operations.price * qtd) * buy_sell)) as banco ,\n" +
      "(SELECT price FROM stocks WHERE symbol =  operations.stock_symbol) as price \n" +
      "FROM operations , stocks a WHERE user_id = ? and a.symbol = operations.stock_symbol group by stock_symbol)", [userId], function (err, result) {
      cb(result);
  })

};

module.exports.checkStockQtd = function (userId, stockSymbol, cb) {
  connection.query("SELECT (SUM((qtd* -1)* buy_sell)) as quantidade FROM operations WHERE user_id = ? and stock_symbol = ? group by stock_symbol", [userId, stockSymbol], function (err, result) {
      cb(result);
  })
};



module.exports.getTotalStocks = function (userId, cb) {
  connection.query("SELECT (SUM((qtd* -1)* buy_sell))*(SELECT price FROM stocks WHERE symbol =  operations.stock_symbol) as total\n" +
      "FROM operations , stocks a WHERE user_id = ? and a.symbol = operations.stock_symbol group by stock_symbol", [userId], function (err, result) {
      cb(result);
  })
};

module.exports.getReports = function (userId, cb) {
  connection.query("SELECT \n" +
      "stock_symbol, qtd, buy_sell, DATE_FORMAT(datetime,\"%d/%m/%Y\") as date,\n" +
      "qtd * price * buy_sell as total \n" +
      "FROM operations WHERE user_id = ? ORDER BY datetime DESC", [userId], function (err, result) {
      cb(result);
  })
};








