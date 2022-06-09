const UserService = require("../services/user.service")

exports.index = async (req, res) => {
    const orders = await UserService.getOrders(req.user)
    return res.render("shop/orders", { title: "Orders", orders })
}

exports.store = async (req, res) => {
    try {
        await UserService.addOrder(req.user)
        return res.redirect("/orders")
    } catch (err) {
        console.log(err)
    }
}
