const Product = require("../models/product")
const { paginate } = require("../utils/paginator")

exports.index = async (req, res, next) => {
    const data = paginate({
        page: req.query.page ?? 1,
        perPage: 2,
        totalItems: await Product.count(),
    })

    console.log("Pagination data", data)

    const products = await Product.find().setOptions(data.options)
    return res.render("shop/index", { title: "Shop page", products })
}
