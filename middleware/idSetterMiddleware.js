const User = require("../models/userModels");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.setUserId = catchAsync(async (req, res, next) => {
  
  if (!req.body.author) {
    const { user } = req.session;
    const currentUser = await User.findOne({ password: user.password });
    req.body.author = currentUser._id
  }
  next()
});