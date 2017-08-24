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

module.exports.new = function (namegroup, aboutgroup, cb) {
    connection.query("INSERT INTO groups (name,about) " +
        "values (?,?)", [namegroup, aboutgroup], function (err, result) {
        cb(result.insertId);

    });
};

module.exports.addUser = function (groupId, userId, isAdmin) {
    connection.query("INSERT INTO groupxusers (group_id,user_id,admin) " +
        "values (?,?,?)", [groupId, userId, isAdmin], function (err, result) {

        console.log(err);
    });
};

module.exports.addRequestInvite = function (groupId, userId, message) {
    connection.query("INSERT INTO group_member_request (group_id,user_id, message) " +
        "values (?,?,?)", [groupId, userId, message], function (err, result) {

        console.log(err);
    });
};


module.exports.responseInvite = function (inviteId, status) {
    connection.query("UPDATE group_member_request SET status = ? where user_id = ?", [status, userId], function (err, result) {

        console.log(err);
    });
};

module.exports.userHasGroup = function (userId, cb) {
    connection.query("SELECT * FROM groupxusers WHERE user_id = ?", [userId],
        function (err, result) {

            cb(result);
        });
};

module.exports.getGroupMembers = function (groupId,userId, cb) {
    connection.query("SELECT * FROM groupxusers LEFT JOIN users ON groupxusers.user_id = users.id WHERE group_id = ? AND user_id != ?", [groupId,userId], function (err, result) {
       cb(result);
    })
};

module.exports.addUserToGroup = function (groupId, userId) {
    connection.query("INSERT INTO groupxusers (group_id,user_id,admin) " +
        "values (?,?,0)", [groupId, userId], function (err, result) {

        console.log(err);
    });
};

module.exports.deleteRequest = function (userId) {
  connection.query("DELETE FROM group_member_request WHERE user_id = ?", [userId], function (err, result) {
      console.log(err);
  });
};

module.exports.checkGroupLength = function (groupId,cb) {
  connection.query("SELECT group_id FROM groupxusers WHERE group_id = ?", [groupId], function (err, result) {
      cb(result);
  })
};

module.exports.removeUser = function (groupId, userId) {
  connection.query("DELETE FROM groupxusers WHERE group_id = ? AND user_id = ?", [groupId, userId], function (err, result) {
      console.log(err);
  })
};

