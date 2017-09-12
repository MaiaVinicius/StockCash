var express = require("express");
var router = express.Router();
var request = require("request");

var Stock = require("../models/Stock");
var Competition = require("../models/Competition");

router.get('/', function (req, res, next) {

    if (req.session.user) {
        var userId = req.session.user.id;
        Stock.getStocksWalletQtd(userId, function (stockswallet) {
            var myBalance = 50000;
            for (i = 0; i < stockswallet.length; i++) {
                stockswallet[i].price = stockswallet[i].price.toFixed(2);
                myBalance += stockswallet[i].banco;
            }

            //rentabilidade acumulada
            Stock.getTotalStocks(userId, function (totalstocks) {
                var saldoStocks = 0;
                for (i = 0; i < totalstocks.length; i++) {
                    saldoStocks += totalstocks[i].total;
                }
                var saldoTotal = saldoStocks + myBalance;
                var rentabilidadeTotal = ((saldoTotal - 50000) / 50000) * 100;
                //fim rentabilidade acumulada

                Stock.getTopFive(function (topfive) {
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

                                Competition.getCompetitionTopTen(date,competitionId, function (rank) {
                                    Competition.getUserInfoCompetition(date,userId, function (userinforesult) {
                                        var userinfo = userinforesult[0];
                                        res.render('resumo_comp', {
                                                topfive: topfive,
                                                rentabilidade: rentabilidadeTotal.toFixed(2),
                                                myBalance: myBalance.toFixed(2),
                                                stockswallet: stockswallet,
                                                saldoTotal: saldoTotal,
                                                user: req.session.user,
                                                rank: rank,
                                                userinfo: userinfo
                                            }
                                        );
                                    });
                                });
                            });
                        } else {
                            res.render('resumo', {
                                    topfive: topfive,
                                    rentabilidade: rentabilidadeTotal.toFixed(2),
                                    myBalance: myBalance.toFixed(2),
                                    stockswallet: stockswallet,
                                    saldoTotal: saldoTotal,
                                    user: req.session.user
                                }
                            );
                        }
                    });
                });
            });
        });
    } else {
        res.redirect("/login");
    }
});


module.exports = router;

