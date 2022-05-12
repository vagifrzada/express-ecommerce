const express = require("express")
const router = express.Router()
const { validate } = require("../utils/validator")

// Validation schemas
const registerValidationSchema = require("../schema/validation/auth/register-schema")
const loginValidationSchema = require("../schema/validation/auth/login-schema")

// Middlewares
const authController = require("../controllers/auth/auth")
const checkPasswordResetToken = require("../middlewares/check-password-reset-token")

router.get("/login", authController.displayLoginForm)
router.post("/login", validate(loginValidationSchema), authController.login)

router.get("/register", authController.displayRegisterForm)
router.post(
    "/register",
    validate(registerValidationSchema),
    authController.register
)

router.get("/reset-password", authController.displayResetPasswordForm)
router.post("/reset-password", authController.resetPassword)

router.get(
    "/change-password/:token",
    checkPasswordResetToken,
    authController.displayChangePasswordForm
)
router.post("/change-password", authController.changePassword)

router.post("/logout", authController.logout)

module.exports = router
