var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'bf0081729740f5',
    password: '85d2fef8',
    database: 'heroku_9a0ab98794b1b1e'
});

connection.connect(function (err) {
    if (err) console.log(err);
    console.log("Connected!");
});


module.exports = connection;