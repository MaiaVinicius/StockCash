var request = require("request");
var interval = 60000;//ms
var Stock = require("../models/Stock");
var getEndpointUrl = function (stockSymbol) {
    return "http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + stockSymbol + "&interval=1min&outputsize=compact&apikey=CL85UTRJC3TXZPJK";
};
Stock.getAll(function (stocks) {
    var exec = function () {

        for (var i = 0; i < stocks.length; i++) {
            var stock = stocks[i].symbol;

            request({
                url: getEndpointUrl(stock),
                json: true
            }, function (err, response, body) {
                if(body){
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
                            return false;
                        }
                    });
                }
            });
        }
    };
    exec();
    setInterval(exec, interval);
});

