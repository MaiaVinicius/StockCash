/**
 * Created by MaiaVinicius on 25/07/17.
 */
var connection = require("./../connection");

module.exports.getAll = function (cb) {
    connection.query("select * from users", function (err, result) {

        cb(result);
    });
};

module.exports.new = function (data) {
    connection.query("INSERT INTO competitions (name,start_at,end_at,groups)" +
        " VALUES (?,?,?,?)",
        [data.name,data.start_at,data.end_at,data.groups], function (err, result) {

    });
};