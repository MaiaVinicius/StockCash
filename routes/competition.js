var express = require("express");
var router = express.Router();
var request = require("request");

var Stock = require("../models/Stock");
var Competition = require("../models/Competition");

router.get("/", function (req, res) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    var userId = req.session.user.id;
    Competition.checkUserCompetition(userId, function (result) {
        if (result.length > 0) {
            var competitionId = result[0].competition_id;
            Competition.getCompetitionDate(competitionId, function (competitioninforesult) {
                var competitioninfo = competitioninforesult[0];

                var date = competitioninfo.enddate;
                date = new Date(date);
                date = date.getFullYear() + '-' +
                    ('00' + (date.getMonth())).slice(-2) + '-' +
                    ('00' + date.getDate()).slice(-2);
                console.log(date);

                var endDate = Date.parse(date);
                var todaydate = Date.parse(today);
                Competition.getCompetitionRank(date, competitionId, function (rank) {
                    Competition.getUserInfoCompetition(date, userId, function (userinforesult) {
                        var userinfo = userinforesult[0];
                        Competition.getAllRequests(competitionId, function (requests) {
                            Competition.getCompetitionTopOne(date, competitionId, function (one) {
                                Competition.getCompetitionTopSecond(date, competitionId, function (two) {
                                    Competition.getCompetitionTopThird(date, competitionId, function (three) {
                                        var topone = one[0];
                                        var toptwo = two[0];
                                        var topthree = three[0];
                                        if (todaydate > endDate) {
                                            res.render("competition_end", {
                                                rank: rank,
                                                userinfo: userinfo,
                                                topone: topone,
                                                toptwo: toptwo,
                                                topthree: topthree
                                            });
                                        } else {
                                            if (result[0].admin === "1") {
                                                res.render("competition_overview_admin", {
                                                    rank: rank,
                                                    userinfo: userinfo,
                                                    competitioninfo: competitioninfo,
                                                    requests: requests
                                                });
                                            } else {
                                                res.render("competition_overview", {
                                                    rank: rank,
                                                    userinfo: userinfo,
                                                    competitioninfo: competitioninfo
                                                });
                                            }
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        } else {
            Competition.getAllCompetitions(function (competitions) {
                res.render("competition", {competitions: competitions});
            });
        }
    });

});

router.post("/createnew", function (req, res) {
    var endDate = req.body.endDate;
    var competitionName = req.body.competitionName;
    var maxUsers = req.body.maxplayers;
    var regex = /^[A-Za-z\s]+$/;

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    var endtime = yyyy + 1 + "-" + mm + "-" + dd + 1;


    if (regex.test(competitionName)) {
        if (maxUsers >= 2 && maxUsers < 31) {
            if (endDate > today && endDate < endtime) {
                Competition.checkCompetitionName(competitionName, function (resultname) {
                    if (resultname.length === 0) {
                        Competition.newCompetition(competitionName, endDate, maxUsers, function (competitionId) {
                            var userId = req.session.user.id;
                            var val = 1;

                            Stock.getStocksWalletQtd(userId, function (stockswallet) {
                                var myBalance = 50000;
                                for (i = 0; i < stockswallet.length; i++) {
                                    stockswallet[i].price = stockswallet[i].price.toFixed(2);
                                    myBalance += stockswallet[i].banco;
                                }
                                Stock.getTotalStocks(userId, function (totalstocks) {
                                    var saldoStocks = 0;
                                    for (i = 0; i < totalstocks.length; i++) {
                                        saldoStocks += totalstocks[i].total;
                                    }
                                    var totalBalance = saldoStocks + myBalance;

                                    Competition.insertUser(competitionId, userId, totalBalance, val);
                                    res.redirect("/competition");
                                });
                            });
                        });
                    } else {
                        res.json("Já existe uma competição com esse nome.")
                    }
                });
            } else {
                res.json("date error");
            }
        } else {
            res.json("maxUsers error");
        }
    } else {
        res.json("regex error");
    }
});

router.post("/request", function (req, res) {
    var userId = req.session.user.id;
    var competitionId = req.body.competitionId;
    Competition.checkDoubleRequest(competitionId, function (result) {
        if (result.length > 0) {
            res.json("Você já enviou uma solicitação para essa competição.")
        } else {
            Competition.insertRequest(competitionId, userId);
        }
    });
});

router.post("/exitcompetition", function (req, res) {
    var userId = req.session.user.id;
    Competition.deleteUserFromCompetition(userId);
});

router.post("/acceptrequest", function (req, res) {
    var myUser = req.session.user.id;
    var userId = req.body.userId;
    Competition.checkUserCompetition(userId, function (competition) {
        if (competition.length > 0) {
            res.json("Você já está em uma competição");
        } else {
            Competition.getUserBalance(userId, function (balance) {
                Competition.checkUserCompetition(myUser, function (result) {
                    var competitionId = result[0].competition_id;
                    var val = "0";
                    var totalBalance = balance[0].totalbalance;
                    Competition.getCompetitionDate(competitionId, function (competitioninfo) {
                        var maxUsers = competitioninfo[0].max_users;
                        var players = competitioninfo[0].players;

                        if (players < maxUsers) {
                            Competition.insertUser(competitionId, userId, totalBalance, val);
                            Competition.deleteRequest(userId, competitionId);
                        } else {
                            res.json("A competição já está cheia")
                        }
                    });

                });
            });
        }
    });

});

router.post("/denyrequest", function (req, res) {
    var userId = req.body.userId;
    var myUser = req.session.user.id;
    Competition.checkUserCompetition(myUser, function (result) {
        var competitionId = result[0].competition_id;
        Competition.deleteRequest(userId, competitionId);
    });

});

module.exports = router;