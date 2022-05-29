const express = require("express")
const router = express.Router()

const auth = require("../middlewares/auth")

const shopController = require("../controllers/shop")
const productsController = require("../controllers/products")
const cartController = require("../controllers/cart")
const ordersController = require("../controllers/orders")
const invoiceController = require("../controllers/invoices")

// Custom middlewares
const checkInvoiceAuthor = require("../middlewares/invoice-author")

// Home
router.get("/", shopController.index)

// Products
router.get("/products/:productId", productsController.show)

// Cart
router.get("/cart", auth, cartController.index)
router.post("/cart", auth, cartController.store)
router.post("/cart/delete", auth, cartController.delete)

// Orders
router.get("/orders", auth, ordersController.index)
router.post("/orders", auth, ordersController.store)
// router.get("/checkout", null);

// Invoices
router.get(
    "/invoices/:orderId",
    auth,
    checkInvoiceAuthor,
    invoiceController.download
)

module.exports = router
