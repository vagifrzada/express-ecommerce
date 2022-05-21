const { body } = require("express-validator")

const validateProductImage = (value, { req }) => {
    const files = req.files
    const hasImage = files && files.image
    const isEditingState = req.params.productId !== undefined

    if (isEditingState && !hasImage) {
        return true // Skip the validation for editing state
    }

    if (!isEditingState && !hasImage) {
        return false
    }

    const validFileTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"]
    if (!validFileTypes.includes(files.image.mimetype)) {
        throw new Error("File is not a valid image.")
    }

    return true
}

module.exports = [
    body("name")
        .notEmpty()
        .withMessage("Name can't be empty")
        .isString()
        .isLength({ min: 5 })
        .withMessage("Name length should be minimum 5 characters long"),

    body("image")
        .custom(validateProductImage)
        .withMessage("Attached file is not a valid image"),

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
