const User = require("../models/user");

const getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
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

const postSignup = (req, res, next) => {
  console.log("postSignup");
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        console.log("userDoc", userDoc);
        return res.redirect("/signup");
      }
      const user = new User({
        email: email,
        password: password,
        card: { items: [] },
      });
      console.log("user", user);
      return user.save();
    })
    .then((result) => {
      console.log("test");
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

module.exports = {
  getLogin,
  getSignup,
  postLogin,
  postSignup,
  postLogout,
};
