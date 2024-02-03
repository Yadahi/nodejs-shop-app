const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

const postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;

  const product = new Product(null, title, price, imageUrl, description);
  product
    .save()
    .then(() => {
      return res.redirect("/");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  const editMode = req.query.edit;

  Product.findById(productId, (product) => {
    if (!product) {
      // TODO return a error message
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

const postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  const product = new Product(
    id,
    updatedTitle,
    updatedPrice,
    updatedImageUrl,
    updatedDescription
  );
  product
    .save()
    .then(res.redirect("/admin/products"))
    .catch((err) => {
      err.message;
    });
};

const getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

const postDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  Product.deleteById(id);

  return res.redirect("/admin/products");
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
