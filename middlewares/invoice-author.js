const Order = require("../models/order")

module.exports = async (req, res, next) => {
    const orderId = req.params.orderId
    if (!orderId) {
        return res.redirect("/")
    }

    const order = await Order.findById(orderId)

    if (!req.user._id.equals(order.user)) {
        return res.redirect("/")
    }

    return next()
}
