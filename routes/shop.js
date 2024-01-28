const express = require("express");
const path = require("path");

const productsController = require("../controllers/products");

const router = express.Router();

router.get("/", productsController.getProducts);

router.get("/products", productsController.getProducts);

router.get("/cart", productsController.getProducts);

router.get("/checkout", productsController.getProducts);

module.exports = router;
