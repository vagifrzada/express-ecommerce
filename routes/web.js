const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")

const shopController = require("../controllers/shop")
const productsController = require("../controllers/products")
const cartController = require("../controllers/cart")
const ordersController = require("../controllers/orders")
const invoiceController = require("../controllers/invoices")
const checkoutController = require("../controllers/checkout")

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

// Checkout
router.post(
    "/checkout/generate-session",
    auth,
    checkoutController.generateSession
)
router.get("/checkout/success", auth, checkoutController.success)
router.get("/checkout/cancel", auth, checkoutController.cancel)

// Orders
router.get("/orders", auth, ordersController.index)
router.post("/orders", auth, ordersController.store)

// Invoices
router.get(
    "/invoices/:orderId",
    auth,
    checkInvoiceAuthor,
    invoiceController.download
)

module.exports = router
