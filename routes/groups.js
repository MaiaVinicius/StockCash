var express = require('express');
var router = express.Router();
var Group = require("./../models/Group");
var User = require("./../models/User");

/* GET users listing. */
router.get('/', function (req, res, next) {
    Group.getAll(function (result) {
        res.render('group_list', {users: result});
    });
});

router.get('/new', function (req, res, next) {
    User.getAll(function (result) {
        res.render('new_group', {users: result});
    });
});


router.post('/new', function (req, res, next) {
    var postData = req.body;
    postData.users = postData.members.join(",");
    Group.new(postData);
    res.redirect("/");
});

module.exports = router;
