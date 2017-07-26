/**
 * Created by MaiaVinicius on 25/07/17.
 */

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'm3bkfz3b',
    database: 'simuladorbovespadb'
});

/*try {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
    });
}catch (err){
    console.log(err)
}*/


module.exports = connection;