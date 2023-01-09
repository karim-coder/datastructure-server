const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    active: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
    marksObtained: {
      type: Number,
      default: 0,
    },
    totalMark: {
      type: Number,
      default: 0,
    },
    updatedAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000),
    },
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000),
    },
  },
  {
    collection: "test",
  }
);

module.exports = mongoose.models.Test || mongoose.model("Test", userSchema);
