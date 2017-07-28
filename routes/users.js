var express = require('express');
var router = express.Router();
var User = require("./../models/User");
var College = require("./../models/College");

/* GET users listing. */
router.get('/', function (req, res, next) {
    User.getAll(function (result) {
        res.render('new_user', {users: result});
    });
});

router.get('/new', function (req, res, next) {
    College.getAll(function (result) {
        res.render('new_user', {colleges: result});
    });
});

router.post('/new', function (req, res, next) {
    var postData = req.body;

    User.new(postData);
    res.redirect("/");
});

module.exports = router;
