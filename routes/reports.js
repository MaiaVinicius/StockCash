var express = require("express");
var router = express.Router();
var request = require("request");
var Stock = require("../models/Stock");

router.get("/", function (req, res, next) {
   var userId = req.session.user.id;
   Stock.getReports(userId, function (operation) {
       res.render("reports", {operation: operation, user: req.session.user});
   });
});

module.exports = router;