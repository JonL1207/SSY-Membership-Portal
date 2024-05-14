const home_GET = (req, res) => {
    res.locals.user = req.session.user //set logged in user in tempate engine
    res.render("member/account");
};

module.exports = {
    home_GET,
};
