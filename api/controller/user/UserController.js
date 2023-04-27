let mongoose = require("mongoose");
var CryptoJS = require("crypto-js");
const UtilController = require("./../services/UtilController");
const User = require("../../models/User");
const returnCode = require("./../../../config/responseCode").returnCode;
const configuration = require("./../../../config/configuration");
const passwordSecretKey = "d@t@$tructre@2023"; // this is standerd key to generate password

const NodeCache = require("node-cache");
const systemCache = new NodeCache({
  stdTTL: 3600,
  checkperiod: configuration.login.otpValidation,
});

module.exports = {
  accountLoginStatus: async function (req, res, next) {
    try {
      let responseCode = returnCode.invalidSession;
      let userType = "";
      let user, receiverId;
      let notificationCount = 0;
      console.log("Session: ", req.session);

      if (!UtilController.isEmpty(req.session.userId)) {
        responseCode = returnCode.validSession;
        receiverId = req.session.userId;
        if (!UtilController.isEmpty(req.query.fcmToken)) {
          await User.findByIdAndUpdate(req.session.userId, {
            fcmToken: req.query.fcmToken,
          });
        }
        user = await User.findById(req.session.userId)
          .select("fname lname email mobileNo userName userType topicLearned")
          .lean();
        //         notificationCount = await Notification.countDocuments({
        //   receiverId,
        //   read: false
        // });
      }
      UtilController.sendSuccess(req, res, next, {
        responseCode,
        user,
        notificationCount,
      });
    } catch (err) {
      UtilController.sendError(req, res, next, err);
    }
  },
  create: async (req, res, next) => {
    try {
      let userCount = await User.countDocuments({
        email: req.body.email,
      });
      if (userCount === 0) {
        let createObj = req.body;
        createObj["emailVerified"] = true;
        // createObj['shopId'] = req.get("shopId");
        let userPassword = req.body.password;
        createObj["userName"] = createObj.mobileNo;
        var ciphertext = CryptoJS.AES.encrypt(userPassword, passwordSecretKey);
        createObj["password"] = ciphertext.toString();
        await User.create(createObj);
        UtilController.sendSuccess(req, res, next, {
          message: "User is Created successfully",
        });
      } else {
        responseCode = returnCode.duplicate;
        UtilController.sendSuccess(req, res, next, {
          responseCode,
          message: "User already exist",
        });
      }
    } catch (err) {
      UtilController.sendError(req, res, next, err);
    }
  },
  accountLogin: async function (req, res, next) {
    try {
      let userCode = returnCode.validEmail;
      let userType = "user";
      let emailId = req.body.email;
      let userName = req.body.email;
      let password = req.body.password;
      let userResult = {};

      let response = returnCode.invalidToken;
      // check the email, only emap
      // console.log("Session: ", req.session);
      if (!UtilController.isEmpty(emailId)) {
        emailId = emailId.trim();
        let emailCheck = await User.findOne({
          email: emailId,
          // userName,
        }).select("name active mobileNo email  ");
        // userCode = UtilController.checkEmailStatus(emailCheck);
        console.log("UserCode: ", userCode);

        // if (userCode === returnCode.validEmail) {
        // req.session.username = userName;
        //req.session.userId;
        //req.session.employeeId;
        // }
      }
      // check the password
      if (!UtilController.isEmpty(password)) {
        // first check the userType, then check the password in respective collection
        if (UtilController.isEmpty(req.body.email)) {
          userCode = returnCode.invalidSession; //Session is not valid, relogin to generate new session and associate
        } else {
          let emailObj = await User.findOne({
            email: req.body.email,
          }).select("name active email mobileNo password");
          if (emailObj) {
            userCode = UtilController.comparePassword(
              emailObj.password,
              password,
              passwordSecretKey
            );
            if (userCode === returnCode.passwordMatched) {
              systemCache.set(
                req.sessionID,
                emailObj._id,
                configuration.login.otpValidation
              );
              userCode = returnCode.validSession;
              response = returnCode.validSession;
              let userSes = systemCache.get(req.sessionID);
              console.log("User Ses: ", userSes);
              // check for two factor authorization
              // if (configuration.login["2FactorAuthentication"]) {
              //   userCode = returnCode["2FactorEnabled"];
              //   systemCache.set(
              //     req.sessionID,
              //     emailObj._id,
              //     configuration.login.otpValidation
              //   ); // 10 minute time
              //   await module.exports.sendOtp(req, emailObj);
              // } else {
              // req.session.userId = emailObj._id;

              if (!(typeof userSes === "undefined" || userSes === null)) {
                req.session.userId = userSes;

                userResult = await User.findByIdAndUpdate(userSes, {
                  lastLogin: Math.floor(Date.now() / 1000),
                });
                req.session.userType = userResult.userType;
                req.session.shopId = userResult.shopId;
              } else {
                response = returnCode.invalidToken;
              }
              // userResult = await User.findOneAndUpdate(
              //   {
              //     email: req.body.email,
              //   },
              //   {
              //     lastLogin: Math.floor(Date.now() / 1000),
              //   }
              // );
              // }
            } else {
              userCode = returnCode.invalidToken;
              // await User.findOneAndUpdate(
              //   {
              //     userName: req.session.username,
              //   },
              //   {
              //     $inc: {
              //       passwordAttempt: 1,
              //     },
              //   }
              // );
            }
          } else {
            userCode = returnCode.invalidToken;
          }
        }
      }
      UtilController.sendSuccess(req, res, next, {
        responseCode: userCode,
        user: userResult,
      });
    } catch (err) {
      UtilController.sendError(req, res, next, err);
    }
  },

  accountLogout: async function (req, res, next) {
    try {
      if (!UtilController.isEmpty(req.session.userId)) {
        req.session.destroy();
      }
      UtilController.sendSuccess(req, res, next, {
        message: "user account is logout successfully",
      });
    } catch (err) {
      UtilController.sendError(req, res, next, err);
    }
  },
};
