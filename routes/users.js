var express = require("express");
var router = express.Router();

const UserController = require("../api/controller/user/UserController");
const TestController = require("../api/controller/user/TestController");
const QuizController = require("../api/controller/user/QuizController");

router.use(function (req, res, next) {
  next();
});

/* GET users related listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.route("/create").post(UserController.create);
router.route("/update").put(UserController.update);
router.route("/delete").post(UserController.deleteUser);
router.route("/all").post(UserController.getAllUser);
router.route("/login").post(UserController.accountLogin);
router.route("/admin/login").post(UserController.accountAdminLogin);
router.route("/islogin").get(UserController.accountLoginStatus);
router.route("/logout").get(UserController.accountLogout);

// test
router.route("/test/create").post(TestController.createTest); // Post
router.route("/test/all").get(TestController.getAllTest); // Post
router.route("/test").post(TestController.getUserTest); // Post

// quiz
router.route("/quiz/create").post(QuizController.createQuiz); // Post
router.route("/quiz/delete").post(QuizController.deleteQuiz); // Post
router.route("/quiz/all").post(QuizController.getAllQuiz); // Post
router.route("/quiz/update").put(QuizController.updateQuiz); // Put
router.route("/quiz/topic").post(QuizController.getQuizBasedOnTopic); // Post

// Dashboard

router.route("/dashboard").get(UserController.getUserAndQuizCount);

module.exports = router;
