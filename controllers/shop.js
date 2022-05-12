const Product = require("../models/product");

exports.index = async (req, res) => {
    const products = await Product.find();
    return res.render("shop/index", { title: "Shop page", products });
}