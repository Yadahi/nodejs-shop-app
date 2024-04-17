const fs = require("fs");
const path = require("path");
const Product = require("../models/product");
const Order = require("../models/order");
const PDFDocument = require("pdfkit");

const ITEMS_PER_PAGE = 2;

const getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        path: "/products",
        product: product,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

/**
 * Retrieves a paginated list of products from the database and renders the
 * "shop/index" view with the products and pagination information.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise} A promise that resolves when the view is rendered.
 */
const getIndex = (req, res, next) => {
  const page = req.query.page;
  let totalItems;

  /**
   * The code retrieves the total number of products from the database and
   * performs a paginated query to retrieve a subset of products based
   * on the specified page number and items per page.
   */

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        totalProducts: totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items; // array of products
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postCardDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .removeFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })

    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return { quantity: item.quantity, product: { ...item.productId._doc } };
      });
      const order = new Order({
        user: { email: req.user.email, userId: req.user },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

const getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId).then((order) => {
    if (!order) {
      return next(new Error("No order found."));
    }
    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error("Unauthorized"));
    }
    const invoiceName = "invoice-" + orderId + ".pdf";
    const invoicePath = path.join("data", "invoices", invoiceName);

    // Create a document
    const pdfDoc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=" + invoiceName);

    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text("Invoice", {
      underline: true,
    });

    pdfDoc.fontSize(16).text("-----------------------");
    let totalPrice = 0;
    order.products.forEach((product) => {
      totalPrice += product.quantity * product.product.price;
      pdfDoc
        .fontSize(16)
        .text(
          product.product.title +
            " - " +
            product.quantity +
            " x " +
            "$" +
            product.product.price
        );
    });

    pdfDoc.text("-----------------------");
    pdfDoc.fontSize(16).text("Total price: $" + totalPrice);

    pdfDoc.end();

    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   res.setHeader("Content-Type", "application/pdf");
    //   res.setHeader("Content-Disposition", "inline; filename=" + invoiceName);
    //   res.send(data);
    // });

    // streaming
  });
};

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  getCheckout,
  postOrder,
  getOrders,
  postCardDeleteProduct,
  getInvoice,
};
