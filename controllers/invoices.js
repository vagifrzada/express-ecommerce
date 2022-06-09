const Order = require("../models/order")
const InvoiceService = require("../services/invoice.service")

async function download(req, res) {
    const order = await Order.findById(req.params.orderId)
    if (!order) {
        throw new Error("Order not found")
    }
    return await InvoiceService.download({
        order,
        res,
    })
}

module.exports = {
    download,
}
