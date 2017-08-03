var express = require("express");
var router = express.Router();
var User = require("../models/User");

router.get("/", function (req, res) {
    var get = req.query;

    if(req.session.user) {
        res.redirect("/");
    }else{
        res.render("login", {layout: false, success: get.success});
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

            res.redirect("/login?success=0");
        }
    });
});


module.exports = router;