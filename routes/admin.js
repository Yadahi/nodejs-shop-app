const express = require("express");
const { body } = require("express-validator");

const path = require("path");

const adminController = require("../controllers/adminController");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get(
  "/add-product",
  [
    body("title", "Title must not be empty!")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("imageUrl", "Image URL must not be empty!").isURL(),
    body("price", "Price must not be empty!").isFloat(),
    body("description", "Description must not be empty!")
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  isAuth,
  adminController.getAddProduct
);

router.get("/products", isAuth, adminController.getProducts);

router.post(
  "/add-product",
  [
    body("title", "Title must not be empty!")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("imageUrl", "Image URL must not be empty!").isURL(),
    body("price", "Price must not be empty!").isFloat(),
    body("description", "Description must not be empty!")
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, adminController.postEditProduct);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
