var express = require('express');
var router = express.Router();
var User = require("./../models/User");
var College = require("./../models/College");


router.get('/new', function (req, res, next) {
    College.getAll(function (result) {
        res.render('new_user', {colleges: result});
    });
});

router.post('/new', function (req, res, next) {
    var postData = req.body;

    User.new(postData);
    res.redirect("/groups/");
});

module.exports = router;
