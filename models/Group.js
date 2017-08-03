/**
 * Created by MaiaVinicius on 25/07/17.
 */
var connection = require("./../connection");

module.exports.getAll = function (cb) {
    connection.query("select * from groups", function (err, result) {

        cb(result);
    });
};

module.exports.getGroupSolicitations = function (groupId, cb) {
    connection.query("select gmr.*,u.name from group_member_request gmr LEFT JOIN users u ON u.id = gmr.user_id where gmr.group_id = ? and gmr.status = 0", [groupId], function (err, result) {

        cb(result);
    });
};

module.exports.new = function (data,cb) {
    connection.query("INSERT INTO groups (name) " +
        "values (?)", [data.name], function (err, result) {

        cb(result.insertId);
        console.log(err);
    });
};

module.exports.addUser = function (groupId, userId) {
    connection.query("INSERT INTO groupxusers (group_id,user_id) " +
        "values (?,?)", [groupId, userId], function (err, result) {

        console.log(err);
    });
};

module.exports.addRequestInvite = function (groupId, userId, message) {
    connection.query("INSERT INTO group_member_request (group_id,user_id, message) " +
        "values (?,?,?)", [groupId, userId,message], function (err, result) {

        console.log(err);
    });
};


module.exports.responseInvite = function (inviteId, status) {
    connection.query("UPDATE group_member_request SET status = ? where id = ?", [status, inviteId], function (err, result) {

        console.log(err);
    });
};

