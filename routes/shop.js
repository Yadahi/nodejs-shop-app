const express = require("express");
const path = require("path");

const shopController = require("../controllers/shopController");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.post("/cart", isAuth, shopController.postCart);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart-delete-item", isAuth, shopController.postCardDeleteProduct);

router.post("/create-order", isAuth, shopController.postOrder);

router.get("/orders", isAuth, shopController.getOrders);

// router.get("/checkout", shopController.getCheckout);

module.exports = router;
