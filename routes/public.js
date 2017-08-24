var express = require('express');
var router = express.Router();

router.get("/groups/", function (req, res) {
    res.render("group_overview");
});




module.exports = router;