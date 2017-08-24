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
    connection.query("select s.*,p.price from stocks s LEFT JOIN stock_prices p ON p.stock_id = s.id where s.active = 1 ", function (err, result) {

        cb(result);
    });
};

module.exports.addPrice = function (stockSymbol, price) {
    //console.log(price)
    connection.query("UPDATE stock_prices SET price = ? WHERE stock_id = (SELECT s.id FROM stocks s WHERE s.symbol = ?)", [price, stockSymbol], function (err, result) {
        // console.log(err)
        //console.log("added")
    });
};


