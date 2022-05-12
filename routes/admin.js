const express = require("express");
const router = express.Router();

const productsController = require("../controllers/admin/products");

router.get("/products", productsController.index);
router.get("/products/create", productsController.create);
router.get("/products/:productId/edit", productsController.edit);
router.post("/products", productsController.store);
router.post("/products/:productId/update", productsController.update);
router.post("/products/delete", productsController.delete);

module.exports = router;