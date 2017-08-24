var express = require("express");
var router = express.Router();
var User = require("../models/User");
var College = require("../models/College");
var Group = require("../models/Group");

router.get("/", function (req, res) {
    var get = req.query;
    if (req.session.user) {
        res.redirect("/");
    } else {
        College.getAll(function (result) {
            var loginError = get.loginError;
            var registerError = get.registerError;
            res.render('login', {
                colleges: result,
                layout: false,
                loginError: loginError,
                registerError: registerError
            });
        });
    }
});

router.post("/", function (req, res) {
    var postData = req.body;
    User.login(postData.user, postData.password, function (result) {
        if (result.length > 0) {
            //usuario existe
            req.session.user = result[0];
            Group.userHasGroup(req.session.user.id, function (resultgroup) {
                if (result.length > 0) {
                    req.session.group = resultgroup[0];

                    res.redirect("/");
                }
            });
        } else {
            //usuario nao existe
            res.redirect("/login?loginError=1");
        }

    });
});

router.post("/register", function (req, res) {
    var postData = req.body;
    User.userExists(postData.username, postData.email, function (result) {
        if (result.length > 0) {
            res.redirect("/login?registerError=1");
        } else {
            User.new(postData);
            req.session.user = result[0];
            res.redirect("/");
        }
    });
});

module.exports = router;