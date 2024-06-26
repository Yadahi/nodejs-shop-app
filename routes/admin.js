const express = require("express");
const { body } = require("express-validator");

const path = require("path");

const adminController = require("../controllers/adminController");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/products", isAuth, adminController.getProducts);

router.post(
  "/add-product",
  [
    body("title", "Title must not be empty!")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price", "Price must not be empty!").isFloat(),
    body("description", "Description must not be empty!")
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title", "Title must not be empty!")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price", "Price must not be empty!").isFloat(),
    body("description", "Description must not be empty!")
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  isAuth,
  adminController.postEditProduct
);

router.delete("/product/:productId", isAuth, adminController.deleteProduct);

module.exports = router;
