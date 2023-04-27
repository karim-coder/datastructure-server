let mongoose = require("mongoose");

let tagSchema = mongoose.Schema({
  tagType: {
    type: String,
    default: "otc",
  },
  prefix: {
    type: String,
    default: "otc-",
  },
  sequenceNo: {
    type: Number,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Number,
    default: Math.floor(Date.now() / 1000),
  },
  updatedAt: {
    type: Number,
    default: Math.floor(Date.now() / 1000),
  },
});
module.exports = mongoose.model("Tag", tagSchema);
