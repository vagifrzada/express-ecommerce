const { body } = require("express-validator")
const User = require("../../../models/user")

// Custom validators
const checkUniqueEmailValidator = async (value) => {
    const user = await User.findOne({ email: value })
    if (user) {
        throw new Error(
            `Email ${value} is already in use, please pick another one.`
        )
    }
    return true
}

module.exports = [
    body("name")
        .notEmpty()
        .withMessage("Name can't be empty")
        .isLength({ min: 5 })
        .withMessage("Name should be minimum 5 characters long"),

    body("email")
        .notEmpty()
        .withMessage("Email can't be empty")
        .isEmail()
        .withMessage("Email must be in a valid format")
        .custom(checkUniqueEmailValidator),

    body("password")
        .notEmpty()
        .withMessage("Password can't be empty")
        .isLength({ min: 6 })
        .withMessage("Password should be minimum 6 characters long"),

    body("passwordConfirmation").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords have to match")
        }
        return true
    }),
]
