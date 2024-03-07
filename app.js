const express = require("express");
const mongoose = require("mongoose");

const path = require("path");

const app = express();
const User = require("./models/user");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/errorController");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("65da522b5b27c04fd8ca313f")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect("mongodb+srv://vilia:8RGebmFeupiPlK2X@cluster0.t5uhksi.mongodb.net/")
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
