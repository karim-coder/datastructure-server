const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    active: {
      type: Boolean,
      default: true,
    },

    category: {
      type: String,
      default: "",
    },

    isMultiAnswer: {
      type: Boolean,
      default: false,
    },
    quizNumber: String,

    question: {
      type: String,
      default: "",
    },
    options: {
      type: Array,
      default: [],
    },
    answer: {
      type: Array,
      default: [],
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
    collection: "quiz",
  }
);

module.exports = mongoose.models.Quiz || mongoose.model("Quiz", userSchema);
