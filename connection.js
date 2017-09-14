var mysql = require('mysql');

var pool = mysql.createPool({
    host     : 'us-cdbr-iron-east-05.cleardb.net',
    user     : 'bf0081729740f5',
    password : '85d2fef8',
    database : 'heroku_9a0ab98794b1b1e'
});

module.exports = {
    query: function(){
        var sql_args = [];
        var args = [];
        for(var i=0; i<arguments.length; i++){
            args.push(arguments[i]);
        }
        var callback = args[args.length-1];
        pool.getConnection(function(err, connection) {
            if(err) {
                console.log(err);
                return callback(err);
            }
            if(args.length > 2){
                sql_args = args[1];
            }
            connection.query(args[0], sql_args, function(err, results) {
                connection.release(); // nota: sair da pool connection
                if(err){
                    console.log(err);
                    return callback(err);
                }
                callback(null, results);
            });
        });
    }
};