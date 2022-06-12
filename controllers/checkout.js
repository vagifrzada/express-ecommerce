const UserService = require("../services/user.service")
const stripe = require("stripe")(process.env.STRIPE_SECRET)

async function generateSession(req, res, next) {
    const data = {
        line_items: await getLineItems(req.user),
        mode: "payment",
        payment_method_types: ["card"],
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
    }

    const session = await stripe.checkout.sessions.create(data)

    return res.status(200).json({ status: 200, url: session.url })
}

async function success(req, res, next) {
    const user = req.user
    await user.clearCart()

    return res.render("shop/checkout/success", {
        title: "Successful operation",
    })
}
async function cancel(req, res, next) {
    return res.render("shop/checkout/cancel", {
        title: "Operation cancelled",
    })
}

async function getLineItems(user) {
    const cart = await UserService.getCart(user)
    return cart.items.map((item) => {
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.product.name,
                    description: item.product.description,
                },
                unit_amount: item.product.price * 100,
            },
            quantity: item.quantity,
        }
    })
}

module.exports = {
    generateSession,
    success,
    cancel,
}
