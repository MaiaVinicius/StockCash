/**
 * Created by MaiaVinicius on 25/07/17.
 */

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'm3bkfz3b',
    database : 'simuladorbovespadb'
});

connection.connect();


module.exports = connection;