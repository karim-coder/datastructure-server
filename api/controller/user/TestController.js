// let request = require("request");
let mongoose = require("mongoose");
var CryptoJS = require("crypto-js");
const UtilController = require("./../services/UtilController");
const User = require("../../models/User");
const Test = require("../../models/Test");
const returnCode = require("./../../../config/responseCode").returnCode;
const configuration = require("./../../../config/configuration");

module.exports = {
  createTest: async (req, res, next) => {
    try {
      let createObj = req.body;

      createObj["userId"] = req.session.userId;

      await Test.create(createObj);

      if (createObj.totalMark / createObj.marksObtained <= 2)
        await User.findByIdAndUpdate(req.session.userId, {
          $addToSet: { topicLearned: createObj.category },
        });
      UtilController.sendSuccess(req, res, next, {
        message: "Test Created successfully",
      });
    } catch (err) {
      UtilController.sendError(req, res, next, err);
    }
  },
  getAllTest: async (req, res, next) => {
    try {
      let result = await Test.find({
        userId: mongoose.Types.ObjectId(req.session.userId),
      }).sort({
        updatedAt: -1,
      });
      UtilController.sendSuccess(req, res, next, {
        result,
      });
    } catch (err) {
      UtilController.sendError(req, res, next, err);
    }
  },
  getUserTest: async (req, res, next) => {
    try {
      let result = await Test.find({
        userId: req.body.userId,
      }).sort({
        updatedAt: -1,
      });
      UtilController.sendSuccess(req, res, next, {
        result,
      });
    } catch (err) {
      UtilController.sendError(req, res, next, err);
    }
  },

  // getQuestionsBasedOnTopic: async (req, res, next) => {
  //   try {
  //     let result = await Quiz.find({
  //       userId: mongoose.Types.ObjectId(req.session.userId),
  //     }).sort({
  //       updatedAt: -1,
  //     });
  //     UtilController.sendSuccess(req, res, next, {
  //       result,
  //     });
  //   } catch (err) {
  //     UtilController.sendError(req, res, next, err);
  //   }
  // },
};
