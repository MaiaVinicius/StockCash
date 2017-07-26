/**
 * Created by MaiaVinicius on 25/07/17.
 */
var connection = require("./../connection");

module.exports.getAll = function (cb) {
    connection.query("select * from user_groups", function (err, result) {

        cb(result);
    });
};

module.exports.new = function (data) {
    connection.query("INSERT INTO user_groups (name,users) " +
        "values (?,?)", [data.name, data.users], function (err, result) {

        console.log(err);
    });
};