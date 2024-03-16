const User = require("../models/user");

const getLogin = (req, res, next) => {
  console.log("isLoggedIn", req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

const postLogin = (req, res, next) => {
  User.findById("65eb77460b55e1fec5cefbb4")
    .then((user) => {
      console.log("in auth", user);

      if (!user) {
        return res.redirect("/login");
      }
      req.session.isLoggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  getLogin,
  postLogin,
};
