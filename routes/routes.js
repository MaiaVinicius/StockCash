/**
 * Created by MaiaVinicius on 25/07/17.
 */
var index = require('./index');
var users = require('./users');
var resumo = require('./resumo')
var tabelagrupos = require('./tabelagrupos');

var express = require('express');
var app = express();

app.use('/', index);
app.use('/users', users);
app.use('/resumo', resumo);
app.use('/tabelagrupos', tabelagrupos);
