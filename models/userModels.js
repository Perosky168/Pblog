const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requied: [true, 'user must have a name'], 
  },
  email: {
    type: String,
    required: [true, "user must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    require: [true, "user must have a password"],
    minlenght: 8,
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      // this only works on CREATE and SAVE!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: {$ne: false} });
  next();
});


/**
 * custom document instance methods
 *
 * @param {String} plainTextPassword - User's current entered password
 * @param {String} hashPassword - User password from database
 * @returns Boolean
 */
userSchema.methods.comparePassword = async function (
  plainTextPassword,
  hashPassword
) {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

/**
 * Check if user changed password after the token was issued
 * @param {Number} tokenIssuedAt - Generated jwts will include an iat (issued at)
 * @returns Boolean
 */
userSchema.methods.changedPasswordAfter = function (tokenIssuedAt) {
  if (this.passwordChangedAt) {
    const changedTimestamp = new Date(this.passwordChangedAt).getTime() / 1000;

    return tokenIssuedAt < changedTimestamp;
  }

  // FALSE means not changed
  return false;
};

/**
 * Generate reset token to reset password
 * @returns reset token
 */
userSchema.methods.generatePasswordResetToken = function () {
  // simple reset Token for sending to user's mail
  const resetToken = crypto.randomBytes(32).toString('hex');

  // encrypted reset token, save to database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Password reset token will be valid for 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
