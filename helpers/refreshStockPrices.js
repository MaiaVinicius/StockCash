var request = require("request");
var interval = 120000;//ms
var Stock = require("../models/Stock");
var CronJob = require('cron').CronJob;
var getEndpointUrl = function (stockSymbol) {
    return "http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + stockSymbol + "&interval=1min&outputsize=compact&apikey=CL85UTRJC3TXZPJK";
};

    Stock.getAll(function (stocks) {
        var make = function (stock) {
            console.log("...");
            request({
                url: getEndpointUrl(stock),
                json: true
            }, function (err, response, body) {
                if (body) {
                    if (body["Meta Data"]) {
                        var timeSeries1MinuteInterval = body["Time Series (1min)"];
                        var stock = body["Meta Data"]["2. Symbol"];
                        console.log("GOT RESPONSE FOR " + stock);

                        var first = false;

                        Object.keys(timeSeries1MinuteInterval).forEach(function (k) {
                            if (!first) {
                                first = true;
                                var price = timeSeries1MinuteInterval[k]["4. close"];

                                Stock.addPrice(stock, price);
                            } else {
                                return true;
                            }
                        });
                    } else {
                        console.log(body);
                    }
                }
            });
        };
        var exec = function () {
            var t = 0;

            for (var i = 0; i < stocks.length; i++) {
                var stock = stocks[i].symbol;
                t += 300;

                setTimeout(make.bind(null, stock), t);

            }
        };
        exec();
        setInterval(exec, interval);
    });