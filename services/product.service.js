const path = require("path")
const fs = require("fs").promises
const Product = require("../models/product")
const UploadService = require("../services/upload.service")
const PRODUCTS_UPLOAD_DIR = "/public/uploads"

// async function getAll(user) {
//     // const products = await Product.find().select("-__v").populate("userId", "-__v");
//     // select("title price -_id"

//     return await Product.find({ userId: user }).populate("userId")
// }

async function updateProduct(product, { body, files }) {
    const { name, price, description } = body

    product.name = name
    product.price = price
    product.description = description

    const hasImage = files !== null && files.image !== undefined
    if (hasImage) {
        const result = await UploadService.upload({
            filesBag: files,
            property: "image",
            uploadDir: PRODUCTS_UPLOAD_DIR,
        })
        // Refactor it to somewhere
        const oldFilePath = path.join(
            path.dirname(require.main.filename),
            PRODUCTS_UPLOAD_DIR,
            product.image
        )

        try {
            // Delete old image
            await fs.unlink(oldFilePath)
        } catch (err) {
            console.log(`Couldn't unlink file: ${err.message}`)
        } finally {
            product.image = result.fileName
        }
    }

    return await product.save()
}

async function createProduct({ body, files, user }) {
    const { name, price, description } = body

    const result = await UploadService.upload({
        filesBag: files,
        property: "image",
        uploadDir: PRODUCTS_UPLOAD_DIR,
    })

    const product = new Product({
        name,
        image: result.fileName,
        price,
        description,
        userId: user,
    })
    return await product.save()
}

async function destroy(product) {
    // Duplicated code, refactor it
    const oldFilePath = path.join(
        path.dirname(require.main.filename),
        PRODUCTS_UPLOAD_DIR,
        product.image
    )

    try {
        // Delete old image
        await fs.unlink(oldFilePath)
    } catch (err) {
        console.log(`Couldn't unlink file: ${err.message}`)
    }

    await Product.deleteOne({ _id: product._id })
}

async function checkAuthor(product, user) {
    if (!product.userId.equals(user._id)) {
        throw new Error("User is not authorized to perform operation")
    }
    return true
}

module.exports = {
    // getAll,
    createProduct,
    updateProduct,
    checkAuthor,
    destroy,
}
