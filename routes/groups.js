var express = require('express');
var router = express.Router();
var Group = require("./../models/Group");
var User = require("./../models/User");

/* GET users listing. */
router.get('/', function (req, res, next) {
    Group.getAll(function (result) {
        Group.userHasGroup(req.session.user.id, function (userGroup) {
            res.render('group_list', {groups: result, hasGroup: userGroup, user: req.session.user});
        });
    });
});


router.get('/new', function (req, res, next) {
    User.getAll(function (usersresult) {
        Group.userHasGroup(req.session.user.id, function (result) {
            if (result.length > 0) {
                res.render("new_group_error");
            }
            else {
                res.render('new_group', {users: usersresult, user: req.session.user});
            }
        });
    });
});

router.get("/manage", function (req, res) {
    if (req.session.group) {
        var isAdmin = req.session.group.admin === 1;
        var groupId = req.session.group.group_id;
        var userId = req.session.user.id;

        User.getAll(function (usersresult) {
            Group.getGroupMembers(groupId, userId, function (members) {
                Group.getGroupSolicitations(groupId, function (result) {
                if (isAdmin) {
                    res.render("group_manage_admin", {
                        users: usersresult,
                        user: req.session.user,
                        member: members,
                        solicitations: result
                    });
                } else {
                    res.render("group");
                }
            });
        });
        }, userId);
    } else {
        res.redirect("/groups");
    }
});

router.post('/new', function (req, res, next) {
    var postData = req.body;
    var userId = req.session.user.id;
    Group.new(postData.namegroup, postData.aboutgroup, function (groupId) {
        Group.addUser(groupId, userId, 1);
        Group.userHasGroup(userId, function (result) {
            req.session.group = result[0];
            res.redirect("/groups/manage");
        });
    })

});

router.post('/send_request', function (req, res, next) {
    var postData = req.body;
    var userId = req.session.user.id;
    Group.userHasGroup(req.session.user.id, function (result) {
        if (result.length > 0) {
            res.redirect("/");
        }
        else {
            Group.addRequestInvite(postData.groupId, userId, postData.message);
            res.json({success: true});
        }
    });
});

router.post('/admin/invite_response', function (req, res, next) {
    var isAdmin = req.session.group.admin === 1;
    var groupId = req.session.group.group_id;
    var postData = req.body;

    if (isAdmin) {
        if (postData.val == 1) {
            Group.checkGroupLength(groupId, function (result) {
                if (result.length < 8) {
                    Group.addUserToGroup(groupId, postData.userId);
                    Group.deleteRequest(postData.userId);
                } else {
                    res.redirect("/groups/manage");
                }
            });
        } else {
            Group.deleteRequest(postData.userId);
        }
    } else {
    }
});

router.post("/admin/removeuser", function (req,res) {
   var isAdmin = req.session.group.admin === 1;
   var groupId = req.session.group.group_id;
   var postData = req.body;

   if (isAdmin) {
   Group.removeUser(groupId, postData.userId);
   }
   else {

   }
});


module.exports = router;
