var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var multer = require("multer");
var session = require("express-session");
const MongoStore = require("connect-mongo")(session);
var cors = require("cors");
var xss = require("xss-clean");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

const mongoose = require("mongoose");
const connection = require("./config/connection");

if (!(connection.dbUrl === undefined || connection.dbUrl.length <= 0)) {
  mongoose.set("debug", false);
  mongoose.Promise = require("bluebird");
  mongoose.Promise = global.Promise;
  mongoose.connect(connection.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let db = mongoose.connection;
  db.once("open", function () {
    console.log("Db connnected");
  });
  db.on("error", function (err) {
    console.error(err);
  });
}

var corsOptions = {
  origin: "http://localhost:3000", // webpack dev server port

  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// app.use(xss());
// app.use(multer());

app.use(
  session({
    secret: "karim123",
    resave: false, //don't save session if unmodified
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      //touchAfter: 24 * 3600, // time period in seconds
      ttl: 30 * 24 * 60 * 60, // = 14 days. Default
      autoRemove: "native", // Default
    }),
    rolling: true,
    cookie: {
      originalMaxAge: 30 * 24 * 60 * 60 * 1000,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: false,
      // expires: new Date(Date.now() + 300000),
    },
  })
);
app.use(cookieParser());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
