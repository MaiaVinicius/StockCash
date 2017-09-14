var connection = require("./../connection");

module.exports.newCompetition = function (competitionName, endDate, maxUsers, cb) {
    connection.query("INSERT INTO competitions (name, end_at, max_users, start_at) values (?,?,?,CURDATE())", [competitionName, endDate, maxUsers], function (err, result) {
        cb(result.insertId);
    })
};

module.exports.checkCompetitionName = function (competitionName, cb) {
    connection.query("SELECT * FROM competitions WHERE name = ?", [competitionName], function (err, result) {
        cb(result);
    });
};

module.exports.insertUser = function (competitionId, userId, totalBalance, val) {
    connection.query("INSERT INTO competitionsxusers (competition_id, user_id, start_balance, admin) values (?,?,?,?)", [competitionId, userId, totalBalance, val], function (err, result) {
        console.log(err);
    });
};

module.exports.getAllCompetitions = function (cb) {
    connection.query("SELECT c.id, c.name, DATE_FORMAT(c.start_at, \"%d/%m/%Y\")startdate, DATE_FORMAT(c.end_at, \"%d/%m/%Y\")enddate, c.max_users, COUNT(u.user_id)players FROM competitions c  \n" +
        "JOIN competitionsxusers u  ON c.id = u.competition_id\n" +
        "WHERE c.end_at > CURDATE()\n" +
        "GROUP BY competition_id", function (err, result) {
        cb(result);
    });
};

module.exports.insertRequest = function (competitionId, userId) {
    connection.query("INSERT INTO competitionsrequest (competition_id, user_id) VALUES (?,?)", [competitionId, userId], function (err, result) {
    });
};

module.exports.checkDoubleRequest = function (competitionId, cb) {
    connection.query("SELECT * FROM competitionsrequest WHERE competition_id = ?", [competitionId], function (err, result) {
        cb(result);
    });
};

module.exports.checkUserCompetition = function (userId, cb) {
    connection.query("SELECT * FROM competitionsxusers WHERE user_id = ?", [userId], function (err, result) {
        cb(result);
    });
};

module.exports.getCompetitionRank = function (date,competitionId, cb) {
    connection.query("SELECT  \n" +
        "        c.user_id, u.username, u.name,\n" +
        "\n" +
        "        (((SELECT ((SUM((qtd* -1)* buy_sell))*(SELECT price FROM stocks WHERE symbol = o.stock_symbol)) + (SELECT 50000 + (SUM((o.price * qtd) * buy_sell)) as banco)\n" +
        "        FROM operations o, stocks a WHERE a.symbol = o.stock_symbol and o.user_id = c.user_id and o.datetime < ?) - c.start_balance) / c.start_balance * 100 )variacao,\n" +
        "    \n" +
        "        ((SELECT ((SUM((qtd* -1)* buy_sell))*(SELECT price FROM stocks WHERE symbol = o.stock_symbol)) + (SELECT 50000 + (SUM((o.price * qtd) * buy_sell)) as banco)\n" +
        "        FROM operations o, stocks a WHERE a.symbol = o.stock_symbol and o.user_id = c.user_id and o.datetime < ?) - c.start_balance) acumulado\n" +
        "\n" +
        "        FROM competitionsxusers c JOIN users u ON c.user_id = u.id WHERE competition_id = ? ORDER BY variacao DESC", [date,date,competitionId], function (err, result) {
        cb(result);
    });
};

module.exports.getUserInfoCompetition = function (date,userId, cb) {
    connection.query("SELECT \n" +
        "        \n" +
        "        c.user_id, u.username, u.name,\n" +
        "       \n" +
        "        (((SELECT ((SUM((qtd* -1)* buy_sell))*(SELECT price FROM stocks WHERE symbol = o.stock_symbol)) + (SELECT 50000 + (SUM((o.price * qtd) * buy_sell)) as banco)\n" +
        "        FROM operations o, stocks a WHERE a.symbol = o.stock_symbol and o.user_id = c.user_id and o.datetime < ?) - c.start_balance) / c.start_balance * 100 )variacao,\n" +
        "\n" +
        "        ((SELECT ((SUM((qtd* -1)* buy_sell))*(SELECT price FROM stocks WHERE symbol = o.stock_symbol)) + (SELECT 50000 + (SUM((o.price * qtd) * buy_sell)) as banco)\n" +
        "        FROM operations o, stocks a WHERE a.symbol = o.stock_symbol and o.user_id = c.user_id and o.datetime < ?) - c.start_balance) acumulado\n" +
        "      \n" +
        "        FROM (SELECT @rownum := 0) r ,competitionsxusers c JOIN users u ON c.user_id = u.id WHERE user_id = ? ORDER BY variacao DESC", [date,date,userId], function (err, result) {
        cb(result);
    });
};

module.exports.getCompetitionDate = function (competitionId, cb) {
    connection.query("SELECT c.id, c.name, DATE_FORMAT(c.start_at, \"%d/%m/%Y\")startdate, DATE_FORMAT(c.end_at, \"%d/%m/%Y\")enddate, c.max_users, COUNT(u.user_id)players FROM competitions c LEFT JOIN competitionsxusers u ON c.id = u.competition_id WHERE competition_id = ?", [competitionId], function (err, result) {
        cb(result);
    });
};

module.exports.deleteUserFromCompetition = function (userId) {
    connection.query("DELETE FROM competitionsxusers WHERE user_id = ?", [userId], function (err, result) {
    });
};

module.exports.getAllRequests = function (competitionId,cb) {
  connection.query("SELECT competition_id, user_id, name FROM competitionsrequest JOIN users ON competitionsrequest.user_id = users.id WHERE competition_id = ?", [competitionId], function (err, result) {
      cb(result)
  })
};

module.exports.getUserBalance = function (userId,cb) {
  connection.query("SELECT ((SUM((qtd* -1)* buy_sell))*(SELECT price FROM stocks WHERE symbol = o.stock_symbol)) + (SELECT 50000 + (SUM((o.price * qtd) * buy_sell)) as banco)totalbalance\n" +
      "FROM operations o, stocks a WHERE a.symbol = o.stock_symbol and o.user_id = ?", [userId], function (err, result) {
      cb(result);
  })
};

module.exports.deleteRequest = function (userId, competitionId) {
    connection.query("DELETE FROM competitionsrequest WHERE user_id = ? and competition_id = ?", [userId, competitionId], function (err, result) {
    });
};

module.exports.getCompetitionTopTen = function (date,competitionId, cb) {
    connection.query("SELECT  \n" +
        "        c.user_id, u.username, u.name,\n" +
        "\n" +
        "        (((SELECT ((SUM((qtd* -1)* buy_sell))*(SELECT price FROM stocks WHERE symbol = o.stock_symbol)) + (SELECT 50000 + (SUM((o.price * qtd) * buy_sell)) as banco)\n" +
        "        FROM operations o, stocks a WHERE a.symbol = o.stock_symbol and o.user_id = c.user_id and o.datetime < ? ) - c.start_balance) / c.start_balance * 100 )variacao,\n" +
        "    \n" +
        "        ((SELECT ((SUM((qtd* -1)* buy_sell))*(SELECT price FROM stocks WHERE symbol = o.stock_symbol)) + (SELECT 50000 + (SUM((o.price * qtd) * buy_sell)) as banco)\n" +
        "        FROM operations o, stocks a WHERE a.symbol = o.stock_symbol and o.user_id = c.user_id and o.datetime < ?) - c.start_balance) acumulado\n" +
        "\n" +
        "        FROM competitionsxusers c JOIN users u ON c.user_id = u.id WHERE competition_id = ? ORDER BY variacao DESC limit 10", [date,date,competitionId], function (err, result) {
        cb(result);
    })
};

module.exports.getCompetitionTopOne = function (date,competitionId, cb) {
    connection.query("SELECT  \n" +
        "        c.user_id, u.username, u.name,\n" +
        "\n" +
        "        (((SELECT ((SUM((qtd* -1)* buy_sell))*(SELECT price FROM stocks WHERE symbol = o.stock_symbol)) + (SELECT 50000 + (SUM((o.price * qtd) * buy_sell)) as banco)\n" +
        "        FROM operations o, stocks a WHERE a.symbol = o.stock_symbol and o.user_id = c.user_id and o.datetime < ? ) - c.start_balance) / c.start_balance * 100 )variacao,\n" +
        "    \n" +
        "        ((SELECT ((SUM((qtd* -1)* buy_sell))*(SELECT price FROM stocks WHERE symbol = o.stock_symbol)) + (SELECT 50000 + (SUM((o.price * qtd) * buy_sell)) as banco)\n" +
        "        FROM operations o, stocks a WHERE a.symbol = o.stock_symbol and o.user_id = c.user_id and o.datetime < ?) - c.start_balance) acumulado\n" +
        "\n" +
        "        FROM competitionsxusers c JOIN users u ON c.user_id = u.id WHERE competition_id = ? ORDER BY variacao DESC limit 0,1", [date,date,competitionId], function (err, result) {
        cb(result);
    })
};

module.exports.getCompetitionTopSecond = function (date,competitionId, cb) {
    connection.query("SELECT  \n" +
        "        c.user_id, u.username, u.name,\n" +
        "\n" +
        "        (((SELECT ((SUM((qtd* -1)* buy_sell))*(SELECT price FROM stocks WHERE symbol = o.stock_symbol)) + (SELECT 50000 + (SUM((o.price * qtd) * buy_sell)) as banco)\n" +
        "        FROM operations o, stocks a WHERE a.symbol = o.stock_symbol and o.user_id = c.user_id and o.datetime < ? ) - c.start_balance) / c.start_balance * 100 )variacao,\n" +
        "    \n" +
        "        ((SELECT ((SUM((qtd* -1)* buy_sell))*(SELECT price FROM stocks WHERE symbol = o.stock_symbol)) + (SELECT 50000 + (SUM((o.price * qtd) * buy_sell)) as banco)\n" +
        "        FROM operations o, stocks a WHERE a.symbol = o.stock_symbol and o.user_id = c.user_id and o.datetime < ?) - c.start_balance) acumulado\n" +
        "\n" +
        "        FROM competitionsxusers c JOIN users u ON c.user_id = u.id WHERE competition_id = ? ORDER BY variacao DESC limit 1,1", [date,date,competitionId], function (err, result) {
        cb(result);
    })
};

module.exports.getCompetitionTopThird = function (date,competitionId, cb) {
    connection.query("SELECT  \n" +
        "        c.user_id, u.username, u.name,\n" +
        "\n" +
        "        (((SELECT ((SUM((qtd* -1)* buy_sell))*(SELECT price FROM stocks WHERE symbol = o.stock_symbol)) + (SELECT 50000 + (SUM((o.price * qtd) * buy_sell)) as banco)\n" +
        "        FROM operations o, stocks a WHERE a.symbol = o.stock_symbol and o.user_id = c.user_id and o.datetime < ? ) - c.start_balance) / c.start_balance * 100 )variacao,\n" +
        "    \n" +
        "        ((SELECT ((SUM((qtd* -1)* buy_sell))*(SELECT price FROM stocks WHERE symbol = o.stock_symbol)) + (SELECT 50000 + (SUM((o.price * qtd) * buy_sell)) as banco)\n" +
        "        FROM operations o, stocks a WHERE a.symbol = o.stock_symbol and o.user_id = c.user_id and o.datetime < ?) - c.start_balance) acumulado\n" +
        "\n" +
        "        FROM competitionsxusers c JOIN users u ON c.user_id = u.id WHERE competition_id = ? ORDER BY variacao DESC limit 2,1", [date,date,competitionId], function (err, result) {
        cb(result);
    })
};















