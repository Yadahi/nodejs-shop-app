const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const helmet = require("helmet");
const compress = require("compression");
const morgan = require("morgan");
const fs = require("fs");
const https = require("https");

const path = require("path");
const MONGODB_URI = `${process.env.MONGO_SCHEME}://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();
const User = require("./models/user");
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

// const privateKey = fs.readFileSync("server.key");
// const certificate = fs.readFileSync("server.cert");

// multer configuration
const fileStorage = multer.diskStorage({
  /**
   * A callback to determine the destination directory for uploaded files.
   *
   * @param {Object} req - The request object
   * @param {Object} file - The file object being uploaded
   * @param {Function} cb - The callback function to return the destination directory
   * @return {void}
   */
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  /**
   * Generates a unique filename for an uploaded file.
   *
   * @param {Object} req - The request object.
   * @param {Object} file - The file object being uploaded.
   * @param {Function} cb - The callback function to return the generated filename.
   * @return {void}
   */
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

/**
 * Checks the mimetype of the uploaded file and passes a boolean value to the callback.
 *
 * @param {Object} req - The request object
 * @param {Object} file - The file object being uploaded
 * @param {Function} cb - The callback function to handle the result
 * @return {void}
 */
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/errorController");
const authRoutes = require("./routes/auth");
const bodyParser = require("body-parser");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(compress());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Middleware function to handle file uploads using multer.
 */
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use("/500", errorController.get500);
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    // https
    //   .createServer({ key: privateKey, cert: certificate }, app)
    //   .listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => console.log(err));
