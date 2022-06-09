const Order = require("../models/order")
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const MailerService = require("../services/mailer.service")
const InvoiceService = require("../services/invoice.service")
const crypto = require("crypto")

async function getCart(user) {
    return user.populate("cart.items.product").then((user) => user.cart)
}

async function create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 12)
    const user = new User({
        name: data.name,
        email: data.email,
        password: hashedPassword,
    })

    return await user.save()
}

async function validatePassword(givenPassword, userPassword) {
    return await bcrypt.compare(givenPassword, userPassword)
}

async function addToCart(user, product) {
    const cart = { ...user.cart }
    const foundItemIndex = cart.items.findIndex((item) =>
        item.product.equals(product._id)
    )

    if (foundItemIndex >= 0) {
        cart.items[foundItemIndex].quantity += 1
    } else {
        cart.items.push({ product: product._id, quantity: 1 })
    }

    user.cart = cart
    return await user.save()
}

async function deleteItemFromCart(user, product) {
    const userCart = { ...user.cart }
    userCart.items = userCart.items.filter(
        (item) => !item.product.equals(product._id)
    )
    user.cart = userCart
    return await user.save()
}

async function getOrders(user) {
    return await Order.find({ user })
}

async function addOrder(user) {
    const cart = await getCart(user)
    const order = new Order({ items: cart.items, user })
    const createdOrder = await order.save()
    await user.clearCart()
    await InvoiceService.generate({
        order: createdOrder,
    })
    return createdOrder
}

async function resetPassword(user) {
    crypto.randomBytes(32, async (err, buffer) => {
        const token = buffer.toString("hex")
        console.log("Token is: ", token)
        user.passwordResetToken = token
        user.passwordResetTokenExpiry = Date.now() + 3600000 // 1 hour in millis
        await user.save()

        const passwordResetLink =
            process.env.APP_DOMAIN +
            `/auth/change-password/${user.passwordResetToken}`
        await MailerService.sendEmail({
            to: user.email,
            subject: "Password reset",
            body: `
                <p>You've requested to reset password.</p>
                <p>Click the link to reset password.</p>
                <p><a href="${passwordResetLink}">Reset password</a></p>
            `,
        })
    })
}

async function changePassword(user, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    user.password = hashedPassword
    await user.save()
    return user
}

module.exports = {
    getCart,
    addToCart,
    deleteItemFromCart,
    getOrders,
    addOrder,
    create,
    validatePassword,
    resetPassword,
    changePassword,
}
