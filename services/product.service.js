const Product = require("../models/product")

async function getAll(user) {
    // const products = await Product.find().select("-__v").populate("userId", "-__v");
    // select("title price -_id")
    return await Product.find({ userId: user }).populate("userId")
}

async function updateProduct(product, data) {
    const { name, image, price, description } = data
    product.name = name
    product.image = image
    product.price = price
    product.description = description
    return await product.save()
}

async function createProduct(data, user) {
    const { name, image, price, description } = data
    const product = new Product({
        name,
        image,
        price,
        description,
        userId: user,
    })
    return await product.save()
}

async function checkAuthor(product, user) {
    if (!product.userId.equals(user._id)) {
        throw new Error("User is not authorized to perform operation")
    }
    return true
}

module.exports = {
    getAll,
    createProduct,
    updateProduct,
    checkAuthor,
}
