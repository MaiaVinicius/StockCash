var express = require('express');
var router = express.Router();
var isAuth = require("../helpers/isAuth");


var dashboard = require('./dashboard');
var login = require ("./login");
var logout = require("./logout");
var stocks = require("./stocks");
var reports = require("./reports");
var competition = require("./competition");
var tutorial = require("./tutorial");

router.use('/', dashboard);
router.use("/login", login);
router.use("/logout", logout);
router.use("/stocks",isAuth, stocks);
router.use("/reports", isAuth, reports);
router.use("/competition", isAuth, competition);
router.use('/tutorial', isAuth, tutorial);


module.exports = router;

