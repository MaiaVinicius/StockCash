var express = require('express');
var router = express.Router();
var isAuth = require("../helpers/isAuth");


var index = require('./index');
var competitions = require('./competition');
var groups = require('./groups');
var dashboard = require('./dashboard');
var login = require ("./login");
var logout = require("./logout");
var public = require("./public");
var stocks = require("./stocks");

router.use('/', index);
router.use('/competitions', isAuth, competitions);
router.use('/groups', isAuth, groups);
router.use('/dashboard', isAuth, dashboard);
router.use("/login", login);
router.use("/logout", logout);
router.use("/public", public);
router.use("/stocks", stocks);


module.exports = router;

