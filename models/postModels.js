const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "post must have title"],
    },
    content: {
      type: String,
      require: [true, "post must have body"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'post must belong to a User!'],
    },
    category: {
      type: String,
      default: "General",
      enum: ["sports", "lifeStyle", "A.I", "web-development", "entertainment", "Religion", "General"]
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

postSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'name _id email name'
  })
  next();
})

const Post = mongoose.model("Post", postSchema);
module.exports = Post;