var CronJob = require('cron').CronJob;
var connection = require("./../connection");


new CronJob('00 6 * * 1-5', function () {

    connection.query("INSERT INTO stocks_prices (price, stock_symbol) (SELECT price, symbol FROM stocks)", function (err, result) {

    });

    console.log("PREÇOS ATUALIZADOS");
}, null, true, 'America/Los_Angeles');
