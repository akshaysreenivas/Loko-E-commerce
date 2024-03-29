const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },

  description: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  },
  path: {
    type: String,
    default: ""

  },
  cloudinary_id:{
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = new mongoose.model("categorys", categorySchema)