const User = require("../../models/user")
const UserService = require("../../services/user.service")

async function displayLoginForm(req, res) {
    return res.render("auth/login", {
        title: "Login form",
    })
}

async function login(req, res) {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            throw new Error(`User not found with email ${email}`)
        }
        const result = await UserService.validatePassword(
            password,
            user.password
        )
        if (!result) {
            throw new Error("Credentials are invalid")
        }
        req.session.user = { id: user._id, email: user.email }
        req.session.isLoggedIn = true
        req.flash("success", `Welcome to the store, ${user.name}`)
        req.session.save(() => res.redirect("/"))
    } catch (err) {
        console.log(err)
        req.flash("error", err.message)
        return res.redirect("/auth/login")
    }
}

async function displayRegisterForm(req, res) {
    return res.render("auth/register", {
        title: "Register form",
    })
}

async function register(req, res) {
    try {
        const { name, email, password } = req.body
        await UserService.create({ name, email, password })
        req.flash("success", "Successfully registered. Please log in")
        return res.redirect("/auth/login")
    } catch (err) {
        req.flash("error", err.message)
        return res.redirect("/auth/register")
    }
}

async function displayResetPasswordForm(req, res) {
    return res.render("auth/reset-password", {
        title: "Reset password",
    })
}

async function displayChangePasswordForm(req, res) {
    return res.render("auth/change-password", {
        title: "Change password",
        userId: req.tokenUser._id,
    })
}

async function changePassword(req, res) {
    try {
        const { identity, password, passwordConfirmation } = req.body
        const user = await User.findById(identity)
        if (!user) {
            throw new Error("User not found")
        }

        if (password !== passwordConfirmation) {
            throw new Error("Passwords mismatch")
        }

        await UserService.changePassword(user, password)
        user.passwordResetToken = null
        user.passwordResetTokenExpiry = null
        await user.save()
        req.flash("success", "Password changed successfully !")
        return res.redirect("/auth/login")
    } catch (err) {
        req.flash("error", err.message)
        return res.redirect("back")
    }
}

async function resetPassword(req, res) {
    try {
        const email = req.body.email
        const user = await User.findOne({ email })
        if (!user) {
            throw new Error(`Email ${email} doesn't exist`)
        }
        await UserService.resetPassword(user)
        return res.redirect("/")
    } catch (err) {
        console.log(err.message)
        req.flash("error", err.message)
        return res.redirect("/auth/reset-password")
    }
}

async function logout(req, res) {
    try {
        await req.session.destroy()
    } catch (err) {
        console.log(err)
    }

    return res.redirect("/")
}

module.exports = {
    displayLoginForm,
    login,
    logout,
    displayRegisterForm,
    register,
    displayResetPasswordForm,
    resetPassword,
    displayChangePasswordForm,
    changePassword,
}
