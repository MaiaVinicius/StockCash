/**
 * Created by MaiaVinicius on 25/07/17.
 */
var index = require('./index');
var users = require('./users');

var express = require('express');
var app = express();

app.use('/', index);
app.use('/users', users);
