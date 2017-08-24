module.exports = function (req, res, next) {
    var redirectTo = "/login";

    if (req.session) {
        if (req.session.user) {
            next();
        } else {
            res.redirect(redirectTo);
        }
    }
};