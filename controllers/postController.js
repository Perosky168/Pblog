const Post = require("../models/postModels");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModels");

exports.setUserId = catchAsync(async (req, res, next) => {
  
  if (!req.body.author) {
    const { user } = req.session;
    const currentUser = await User.findOne({ password: user.password });
    req.body.author = currentUser._id
  }
  next()
});

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();

    res.status(200).json({
      status: "success",
      results: posts.length,
      data: {
        posts,
      },
    })
  } catch(e) {
    res.status(400).json({
      status: "fail",
    })
  }
};

exports.getOnePOst = async (req, res, next) => {
  try {

    const post = await Post.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        post
      },
    })
  } catch(e) {
    res.status(400).json({
      status: "fail",
    })
  }
}

exports.createPOst = catchAsync(async (req, res, next) => {
  try {
    const post = await Post.create(req.body)

    res.status(200).json({
      status: "success",
      data: {
        post
      },
    })
  } catch(e) {
    res.status(401).json({
      status: "fail",
      data: e,
      user: req.session
    });
  }
});

exports.updatePOst = async (req, res, next) => {
  try {

    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      status: "success",
      data: {
        post
      },
    })
  } catch(e) {
    res.status(400).json({
      status: "fail",
    })
  }
}

exports.deletePOst = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id)

    res.status(200).json({
      status: "success",
    })
  } catch(e) {
    res.status(400).json({
      status: "fail",
    })
  }
}