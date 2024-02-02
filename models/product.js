const fs = require("fs");
const path = require("path");

const pathProduct = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (callback) => {
  fs.readFile(pathProduct, (err, fileContent) => {
    if (err) {
      return callback([]);
    }
    callback(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductsIndex = products.findIndex(
          (product) => product.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductsIndex] = this;
        fs.writeFile(pathProduct, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
        return;
      }
      this.id = Math.floor(Math.random() * 99999).toString();
      products.push(this);
      console.log("this", this);
      fs.writeFile(pathProduct, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      if (id) {
        const existingProductsIndex = products.findIndex(
          (product) => product.id === id
        );

        if (existingProductsIndex > 0) {
          const updatedProducts = [...products];
          updatedProducts.splice(existingProductsIndex, 1);

          fs.writeFile(pathProduct, JSON.stringify(updatedProducts), (err) => {
            if (!err) {
              // TODO remove from cart
            }
            console.log(err);
          });
        }
      }
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(id, callback) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      callback(product);
    });
  }
};
