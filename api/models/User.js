const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    active: {
      type: Boolean,
      default: true,
    },
    userName: {
      type: String,
      default: "",
    },
    userType: {
      // user, employer, admin
      type: String,
      default: "user",
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      default: "",
    },
    fname: {
      type: String,
      default: "",
    },
    lname: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    mobileNo: {
      type: String,
      default: "",
    },
    currentSessionId: String,
    fcmToken: {
      type: String,
      default: "",
    },
    dob: Number,
    updatedAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000),
    },
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000),
    },
    lastLogin: {
      type: Number,
    },
  },
  {
    collection: "users",
  }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
