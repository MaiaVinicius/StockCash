var express = require('express');
var router = express.Router();


var index = require('./index');
var users = require('./users');
var competitions = require('./competition');
var groups = require('./groups');
var resumo = require('./resumo');
var tabelagrupos = require('./tabelagrupos');
var login = require ("./login");
var logout = require("./logout");

router.use('/', index);
router.use('/users', users);
router.use('/competitions', competitions);
router.use('/groups', groups);
router.use('/resumo', resumo);
router.use('/tabelagrupos', tabelagrupos);
router.use("/login", login);
router.use("/logout", logout);


module.exports = router;
