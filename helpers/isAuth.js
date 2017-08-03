module.exports = function (req, res) {
    if(req.session){
        if(req.session.user){
            return true;
        }else{
            res.redirect("/login");
            return false;
        }
    }
};