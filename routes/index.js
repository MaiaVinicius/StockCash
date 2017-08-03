var express = require('express');
var router = express.Router();
var isAuth = require("../helpers/isAuth");

/* GET home page. */
router.get('/', function (req, res, next) {
    if (isAuth(req, res)) {
        res.render('index', {user: req.session.user});
    }
});

module.exports = router;
