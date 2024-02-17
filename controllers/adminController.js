const Product = require("../models/product");

// You use it in the same way, so you can simply replace all occurrences of findById() with findByPk()

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
  const product = new Product(title, price, description, imageUrl);
  product
    .save()
    .then((result) => {
      console.log("Created product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

// const getEditProduct = (req, res, next) => {
//   const productId = req.params.productId;
//   const editMode = req.query.edit;

//   if (!editMode) {
//     return res.redirect("/");
//   }
//   req.user
//     .getProducts({ where: { id: productId } })
//     .then((products) => {
//       const product = products[0];
//       if (!product) {
//         return res.redirect("/");
//       }
//       res.render("admin/edit-product", {
//         pageTitle: "Edit Product",
//         path: "/admin/edit-product",
//         editing: editMode,
//         product: product,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// const postEditProduct = (req, res, next) => {
//   const id = req.body.productId;
//   const updatedTitle = req.body.title;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedPrice = req.body.price;
//   const updatedDescription = req.body.description;

//   Product.findByPk(id)
//     .then((product) => {
//       product.title = updatedTitle;
//       product.updatedImageUrl = updatedImageUrl;
//       product.price = updatedPrice;
//       product.description = updatedDescription;
//       return product.save();
//     })
//     .then((result) => {
//       console.log("UPDATED PRODUCT");
//       res.redirect("/admin/products");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

const getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// const postDeleteProduct = (req, res, next) => {
//   const id = req.body.productId;
//   Product.findByPk(id)
//     .then((product) => {
//       return product.destroy();
//     })
//     .then((result) => {
//       console.log("DESTROYED PRODUCT");
//       res.redirect("/admin/products");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
  // getEditProduct,
  // postEditProduct,
  // postDeleteProduct,
};
