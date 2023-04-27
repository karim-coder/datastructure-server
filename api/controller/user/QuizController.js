// let request = require("request");
let mongoose = require("mongoose");
var CryptoJS = require("crypto-js");
const UtilController = require("./../services/UtilController");
const Quiz = require("../../models/Quiz");
const Tag = require("../../models/Tag");
const returnCode = require("./../../../config/responseCode").returnCode;

module.exports = {
  createQuiz: async (req, res, next) => {
    try {
      let createObj = req.body;

      let tagResult = await Tag.findOneAndUpdate(
        { active: true, tagType: "quiz" },

        { $inc: { sequenceNo: 1 }, updatedAt: Math.floor(Date.now() / 1000) }
      );
      createObj["quizNumber"] =
        tagResult.prefix + UtilController.pad(tagResult.sequenceNo, 5);

      await Quiz.create(createObj);
      UtilController.sendSuccess(req, res, next, {
        message: "Quiz Created successfully",
      });
    } catch (err) {
      UtilController.sendError(req, res, next, err);
    }
  },
  updateQuiz: async (req, res, next) => {
    try {
      let updateObj = req.body;
      updateObj["updateAt"] = Math.floor(Date.now() / 1000);
      await Quiz.findByIdAndUpdate(req.body._id, updateObj);
      UtilController.sendSuccess(req, res, next, {
        message: "Quiz Updated successfully",
      });
    } catch (err) {
      UtilController.sendError(req, res, next, err);
    }
  },
  deleteQuiz: async (req, res, next) => {
    try {
      await Quiz.findByIdAndUpdate(req.body.quizId, { active: false });
      UtilController.sendSuccess(req, res, next, {
        message: "Test deleted successfully",
      });
    } catch (err) {
      UtilController.sendError(req, res, next, err);
    }
  },
  getAllQuiz: async (req, res, next) => {
    try {
      let queryObj = req.body;

      let data = await Quiz.find({ active: true }).sort({ updatedAt: -1 });
      UtilController.sendSuccess(req, res, next, {
        rows: data,
      });
    } catch (err) {
      UtilController.sendError(req, res, next, err);
    }
  },
  getQuizById: async (req, res, next) => {
    try {
      let quizId = req.body.quizId;

      let quizData = await Quiz.findById();
      UtilController.sendSuccess(req, res, next, {
        rows: quizData,
      });
    } catch (err) {
      UtilController.sendError(req, res, next, err);
    }
  },
};
