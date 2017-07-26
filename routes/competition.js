var express = require('express');
var router = express.Router();
var Competition = require("./../models/Competition");
var Group = require("./../models/Group");

/* GET users listing. */
router.get('/', function (req, res, next) {
    Competition.getAllCompetitions(function (result) {
        res.render('user_list', {users: result});
    });
});

router.get('/new', function (req, res, next) {
    Group.getAll(function (result) {
        res.render('new_competition', {groups: result});
    });
});

router.post('/new', function (req, res, next) {
    var postData = req.body;
    postData.groups = postData.groups.join(",");
    Group.new(postData);
    res.redirect("/");
});

module.exports = router;
