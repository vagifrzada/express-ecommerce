const express = require("express")
const router = express.Router()
const { validate } = require("../utils/validator")

// Controllers
const productsController = require("../controllers/admin/products")

// Validation schemas
const productValidationSchema = require("../schema/validation/products/product-schema")

router.get("/products", productsController.index)
router.get("/products/create", productsController.create)
router.get("/products/:productId/edit", productsController.edit)
router.post("/products/delete", productsController.delete)
router.post(
    "/products",
    validate(productValidationSchema),
    productsController.store
)
router.post(
    "/products/:productId/update",
    validate(productValidationSchema),
    productsController.update
)

module.exports = router
