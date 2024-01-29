const express = require("express");

const path = require("path");

const adminController = require("../controllers/adminController");

const router = express.Router();

router.get("/add-product", adminController.getAddProduct);

router.get("/products", adminController.getProducts);

router.post("/add-product", adminController.postAddProduct);

module.exports = router;
