var express = require("express");
var router = express.Router();
var request = require("request");

var Stock = require("../models/Stock");

router.get("/buy", function (req, res, next) {

    Stock.getAllWithPrices(function (stocks) {
        Stock.getLeastFive(function (leastfive) {
            Stock.getTopFive(function (topfive) {
                var userId = req.session.user.id;
                Stock.getStocksWalletQtd(userId, function (stockswallet) {
                    var myBalance = 50000;
                    for (i = 0; i < stockswallet.length; i++) {
                        myBalance += stockswallet[i].banco;
                    }
                    res.render("buy_stocks", {
                        user: req.session.user,
                        stocks: stocks,
                        leastfive: leastfive,
                        topfive: topfive,
                        myBalance: myBalance.toFixed(2)
                    });
                })
            })
        })
    })

});

router.post("/buy", function (req, res) {
    var userId = req.session.user.id;
    var stockSymbol = req.body.stockSymbol;
    var stockQuantd = req.body.stockQuantd;

    Stock.getStockPrice(stockSymbol, function (stock) {
        var stockPrice = stock.price;
        var val = "-1";
        Stock.getStocksWalletQtd(userId, function (stockswallet) {
            var myBalance = 50000;
            for (var i = 0; i < stockswallet.length; i++) {
                myBalance += stockswallet[i].banco;
            }
            if ((stockPrice * stockQuantd) <= myBalance) {
                Stock.addStock(userId, stockSymbol, stockPrice, stockQuantd, val);
                res.json({success: true, message: "Operação realizada com sucesso."});
            } else {
                res.json({success: false, message: "Você não tem dinheiro suficiente para realizar esta operação."});
                //res.redirect("buy_stocks")
            }
        });

    });
});


router.get("/getStockPricesBuy", function (req, res, next) {

    Stock.getAllWithPrices(function (stocks) {
        res.json({stocks: stocks});
    });

});

router.get("/getStockPriceSell", function (req, res, next) {
    var userId = req.session.user.id;
    Stock.getStocksWalletQtd(userId, function (stocks) {
        res.json({stocks: stocks});
    });

});


router.get("/sell", function (req, res) {
    var userId = req.session.user.id;

    Stock.getStocksWalletQtd(userId, function (stockswallet) {
        var myBalance = 50000;
        for (i = 0; i < stockswallet.length; i++) {
            stockswallet[i].price = stockswallet[i].price.toFixed(2);
            myBalance += stockswallet[i].banco;
        }
        res.render("sell_stocks", {
            stockswallet: stockswallet,
            myBalance: myBalance.toFixed(2),
            user: req.session.user
        });
    });
});

router.post("/sell", function (req, res) {
    var userId = req.session.user.id;
    var stockSymbol = req.body.stockSymbol;
    var stockQuantd = req.body.stockQuantd;

    Stock.getStockPrice(stockSymbol, function (stock) {
        var stockPrice = stock.price;
        var val = "1";
        Stock.getStocksWalletQtd(userId, function (stockswallet) {
            var myBalance = 50000;
            for (i = 0; i < stockswallet.length; i++) {
                stockswallet[i].price = stockswallet[i].price.toFixed(2);
                myBalance += stockswallet[i].banco;
            }
            Stock.checkStockQtd(userId, stockSymbol, function (stockqtd) {
                if (stockQuantd <= stockqtd) {
                    Stock.addStock(userId, stockSymbol, stockPrice, stockQuantd, val);
                    res.redirect("/stocks/sell")
                }
                else {
                    res.redirect("sell_stocks");
                }
            });
        });
    });
});


module.exports = router;