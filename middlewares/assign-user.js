const User = require("../models/user");

module.exports = async (req, res, next) => {
    if (req.session.isLoggedIn) {
        const user = await User.findById(req.session.user.id);
        req.user = user;
    }
    next();
}