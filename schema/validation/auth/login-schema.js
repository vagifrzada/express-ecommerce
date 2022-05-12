const { body } = require("express-validator")

module.exports = [
    body("email", "Email can't be empty")
        .notEmpty()
        .isEmail()
        .withMessage("Email must be in a valid format"),

    body("password", "Password can't be empty").notEmpty(),
]
