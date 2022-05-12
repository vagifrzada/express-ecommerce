const User = require("../models/user");

module.exports = async (req, res, next) => {
    const token = req.params.token;
    if (!token) {
        return res.redirect("/");
    }

    const user = await User.findOne({
        passwordResetToken: token,
        passwordResetTokenExpiry: { $gt: Date.now() }
    });
    
    if (!user) {
        return res.redirect("/");
    }

    req.tokenUser = user;

    next();
}