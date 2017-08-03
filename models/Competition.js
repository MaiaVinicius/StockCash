/**
 * Created by MaiaVinicius on 25/07/17.
 */
var connection = require("./../connection");

module.exports.getAll = function (cb) {
    connection.query("SELECT c.*, \n" +
        "(SELECT group_concat(g.name)names FROM competitionxgroups cxg \n" +
        "LEFT JOIN groups g ON g.id = cxg.group_id \n" +
        "WHERE cxg.competition_id = c.id AND g.name is not null)groups\n" +
        " FROM competitions c", function (err, result) {

        cb(result);
    });
};

module.exports.new = function (data) {
    connection.query("INSERT INTO competitions (name,start_at,end_at,groups)" +
        " VALUES (?,?,?,?)",
        [data.name,data.start_at,data.end_at,data.groups], function (err, result) {

    });
};