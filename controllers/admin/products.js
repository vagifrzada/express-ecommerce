const Product = require("../../models/product")
const ProductService = require("../../services/product.service")

exports.index = async (req, res) => {
    const products = await ProductService.getAll(req.user)
    return res.render("admin/products", {
        title: "Admin products",
        products,
    })
}

exports.create = (req, res) => {
    return res.render("admin/add-product", {
        title: "Add product page",
    })
}

exports.store = async (req, res) => {
    try {
        await ProductService.createProduct(req.body, req.user)
    } catch (err) {
        console.log(err)
        req.flash("error", err.message)
    }

    return res.redirect("/admin/products")
}

exports.edit = async (req, res) => {
    try {
        const productId = req.params.productId
        const product = await Product.findById(productId)
        if (!product) {
            throw new Error("Product not found !")
        }
        await ProductService.checkAuthor(product, req.user)

        return res.render("admin/edit-product", {
            title: `Shop | ${product.name}`,
            product,
        })
    } catch (err) {
        console.log(err)
        return res.redirect("/admin/products")
    }
}

exports.update = async (req, res) => {
    try {
        // For query params you can use: req.query.{param}
        const productId = req.params.productId
        const product = await Product.findById(productId)
        if (!product) {
            throw new Error("Product not found")
        }

        await ProductService.checkAuthor(product, req.user)
        await ProductService.updateProduct(product, req.body)
        return res.redirect(`/admin/products/${product._id}/edit`)
    } catch (err) {
        console.log(err)
        return res.redirect("/404")
    }
}

exports.delete = async (req, res) => {
    try {
        const productId = req.body.productId
        const product = await Product.findById(productId)
        if (!product) {
            throw new Error("Product not found !")
        }
        await ProductService.checkAuthor(product, req.user)
        await product.deleteOne({ _id: product._id })
        return res.redirect("/admin/products")
    } catch (err) {
        console.log(err)
        return res.redirect("/404")
    }
}
