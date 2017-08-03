var express = require('express');
var router = express.Router();
var Group = require("./../models/Group");
var User = require("./../models/User");

/* GET users listing. */
router.get('/', function (req, res, next) {
    Group.getAll(function (result) {
        res.render('group_list', {groups: result});
    });
});

/* GET users listing. */
router.get('/admin', function (req, res, next) {
    //VALIDAR NA SESSAO SE O USUARIO E ADMIN DE ALGUM GRUPO
    //ESSA VARIAVEL DEVE VIR DA SESSAO
    var groupId = 1;
    // SE FOR, LISTAR AS SOLICITATOES E OUTROS...
    Group.getGroupSolicitations(groupId, function (result) {
        console.log(result);
        res.render('group_admin', {solicitations: result});
    });
});

router.get('/new', function (req, res, next) {
    User.getAll(function (result) {
        res.render('new_group', {users: result});
    });
});


router.post('/new', function (req, res, next) {
    var postData = req.body;
    Group.new(postData, function (groupId) {

        var users = postData.members;

        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            Group.addUser(groupId, user);
        }

        res.redirect("/groups");
    });
});

router.post('/send_request', function (req, res, next) {
    var postData = req.body;
    //ESSE VALOR DEVE VIR DA SESSAO
    var userId = 1;

    Group.addRequestInvite(postData.groupId, userId, postData.message);

    res.json({success: true});
});

router.post('/admin/invite_response', function (req, res, next) {
    var postData = req.body;
    //ESSE VALOR DEVE VIR DA SESSAO
    var userId = 1;

    Group.responseInvite(postData.inviteId, postData.val);

    res.json({success: true});
});

module.exports = router;
