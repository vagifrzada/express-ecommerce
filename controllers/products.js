const Product = require("../models/product");

exports.show = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("Product not found !");
        }
        return res.render("shop/product-detail", {
            title: `Product: ${product.name}`,
            product
        });
    } catch (err) {
        console.log(err);
        return res.redirect("/products");
    }
}