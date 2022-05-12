const { body } = require("express-validator")

module.exports = [
    body("name")
        .notEmpty()
        .withMessage("Name can't be empty")
        .isString()
        .isLength({ min: 5 })
        .withMessage("Name length should be minimum 5 characters long"),

    body("image")
        .notEmpty()
        .withMessage("Image can't be empty")
        .isString()
        .isURL()
        .withMessage("Image must be a valid url"),

    body("price")
        .notEmpty()
        .withMessage("Price can't be empty")
        .isFloat()
        .withMessage("Price must be a decimal number"),

    body("description")
        .notEmpty()
        .withMessage("Description can't be empty")
        .isLength({ min: 10 })
        .withMessage("Description length should be minimum 10 characters long"),
]
