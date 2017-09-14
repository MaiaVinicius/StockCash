var express = require("express");
var router = express.Router();
var User = require("../models/User");

router.get("/", function (req, res) {
    var get = req.query;
    if (req.session.user) {
        res.redirect("/");
    } else {
            var loginError = get.loginError;
            var registerError = get.registerError;
            res.render('login', {
                layout: false,
                loginError: loginError,
                registerError: registerError
            });
    }
});

router.post("/", function (req, res) {
    var postData = req.body;
    User.login(postData.user, postData.password, function (result) {
        if (result.length > 0) {
            //usuario existe
            req.session.user = result[0];
            res.redirect("/");
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
            var username = postData.username;
            var name = postData.name;
            var whitespace = /\s/;

            if (/^[A-Za-zÀ-ÿ\s]+$/.test(name)) {
                if (name.length < 20) {
                    if (/^[A-Za-z0-9]+$/.test(username)) {
                        if (username.length < 15) {
                            if (whitespace.test(username)) {
                                res.json("error username3")
                            } else {
                                User.new(postData);
                                req.session.user = result[0];
                                res.redirect("/");
                            }
                        } else {
                            res.json("error username2")
                        }
                    } else {
                        res.json("error username")
                    }
                } else {
                    res.json("error name2")
                }
            } else {
                res.json("error name");
            }
        }
    });
});

module.exports = router;