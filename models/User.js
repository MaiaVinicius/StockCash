/**
 * Created by MaiaVinicius on 25/07/17.
 */
var connection = require("./../connection");

module.exports.getAll = function (cb, loggedUser) {
    var whereClause = "";
    if (loggedUser) {
        whereClause = "  WHERE id != " + loggedUser;
    }
    connection.query("select * from users" + whereClause, function (err, result) {

        cb(result);
    });
};

module.exports.new = function (data) {
    connection.query("INSERT INTO users (name,username,email,password)" +
        "VALUES (?,?,?,?)", [data.name, data.username, data.email, data.password], function (err, result) {
    });

};

module.exports.login = function (user, pass, cb) {
    connection.query("SELECT * FROM users where (username = ? or email = ?) and password = ?",
        [user, user, pass], function (err, result) {

            cb(result);
        });
};

module.exports.userExists = function (username, email, cb) {
    connection.query("SELECT * FROM users where (username = ? or email = ?)",
        [username, email], function (err, result) {

            cb(result);
        });
};