var express = require("express");
var router = express.Router();
var request = require("request");

var Stock = require("../models/Stock");

router.get("/buy/:stock", function (req, res) {

    res.json(req.params.stock);

});

router.get("/buy", function (req, res) {
    var stock = req.params.stock;

    Stock.getStockPrice(stock, function (price) {

        res.render("buy_stock", {stocks: stocks});
    });

});



module.exports = router;