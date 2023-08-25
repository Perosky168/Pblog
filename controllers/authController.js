const User = require("../models/userModels");
const bcrypt = require("bcryptjs");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  
  req.session.user = newUser;
  console.log(req.session.user)
  res.status(201).json({
    status: 'success',
    data: newUser,
  });
  
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if(!email || !password) return new AppError('please input both email and pasword', 401)

  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  req.session.user = user;
  res.status(200).json({
    status: 'success',
    data: user,
  })

});
