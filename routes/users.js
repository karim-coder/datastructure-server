var express = require("express");
var router = express.Router();

const UserController = require("../api/controller/user/UserController");
const TestController = require("../api/controller/user/TestController");

router.use(function (req, res, next) {
  next();
});

/* GET users related listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.route("/create").post(UserController.create);
router.route("/login").post(UserController.accountLogin);
router.route("/islogin").get(UserController.accountLoginStatus);
router.route("/logout").get(UserController.accountLogout);

// test
router.route("/test/create").post(TestController.createTest); // Post
router.route("/test/all").get(TestController.getAllTest); // Post

module.exports = router;
