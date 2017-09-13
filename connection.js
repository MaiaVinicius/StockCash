/**
 * Created by MaiaVinicius on 25/07/17.
 */

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'bf0081729740f5',
    password: '85d2fef8',
    database: 'heroku_9a0ab98794b1b1e'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});


module.exports = connection;