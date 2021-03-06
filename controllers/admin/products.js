const Product = require("../../models/product")
const ProductService = require("../../services/product.service")
const { paginate } = require("../../utils/paginator")

exports.index = async (req, res) => {
    const pagination = paginate({
        page: req.query.page || 1,
        perPage: 2,
        totalItems: await Product.count(),
    })

    const products = await Product.find({ userId: req.user })
        .populate("userId")
        .setOptions(pagination.options)

    return res.render("admin/products", {
        title: "Admin products",
        products,
        pagination,
    })
}

exports.create = (req, res) => {
    return res.render("admin/add-product", {
        title: "Add product page",
    })
}

exports.store = async (req, res) => {
    try {
        await ProductService.createProduct(req)
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
        await ProductService.updateProduct(product, req)
        return res.redirect(`/admin/products/${product._id}/edit`)
    } catch (err) {
        console.log(err)
        return res.redirect("/404")
    }
}

exports.delete = async (req, res) => {
    try {
        const productId = req.params.productId
        const product = await Product.findById(productId)
        if (!product) {
            throw new Error("Product not found !")
        }
        await ProductService.checkAuthor(product, req.user)
        await ProductService.destroy(product)
        return res.status(200).json({ status: 200, message: "Product deleted" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: 500, message: err.message })
    }
}
