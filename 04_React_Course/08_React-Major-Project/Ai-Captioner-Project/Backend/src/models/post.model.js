const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
  image: String,
  caption: String,
  tone: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },

  createdAt: { type: Date, default: Date.now }

})


const postModel = mongoose.model("post", postSchema);


module.exports = postModel;