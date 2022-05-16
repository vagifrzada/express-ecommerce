const Product = require("../models/product")

exports.index = async (req, res, next) => {
    const products = await Product.find()
    return res.render("shop/index", { title: "Shop page", products })
}
