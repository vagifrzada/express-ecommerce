const User = require("../models/user")

module.exports = async () => {
    const user = await User.findByPk(1)
    if (!user) {
        user = await User.create({
            name: "Vagif Rufullazada",
            email: "vagif@rufullazada.me",
            password: "secret",
        })
    }

    const cart = await user.getCart()
    if (!cart) {
        // Creating cart for user
        await user.createCart()
    }
}
