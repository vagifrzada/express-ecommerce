const Product = require("../models/product");
const User = require("../models/user");
const UserService = require("../services/user.service")

exports.index = async (req, res) => {
    try {
        const cart = await UserService.getCart(req.user);
        return res.render("shop/cart", {
            title: "Cart",
            items: cart.items,
            totalPrice: 0
        });
    } catch (err) {
        console.log(err);
        return res.redirect("/");
    }
};

exports.store = async (req, res) => {
    try {
        const product = await Product.findById(req.body.productId);
        if (!product) {
            throw new Error("Product not found");
        }
        await UserService.addToCart(req.user, product);
        return res.redirect("/cart");
    } catch (err) {
        console.log(err);
        return res.redirect("/");
    }
};

exports.delete = async (req, res) => {
    try {
        const product = await Product.findById(req.body.productId);
        if (!product) {
            throw new Error("Product not found !");
        }
        await UserService.deleteItemFromCart(req.user, product);
    } catch (err) {
        console.log(err);
    }

    return res.redirect("/cart");
};