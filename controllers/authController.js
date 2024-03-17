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
      if (!user) {
        return res.redirect("/login");
      }
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getLogout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
};

module.exports = {
  getLogin,
  postLogin,
  getLogout,
};
