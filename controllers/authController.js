const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const nodemailer = require('nodemailer');
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");



// functions
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  return res.status(statusCode).json({
    status: "success",
    token,
    data: {
      _id: user._id,
      role: user.role,
      active:user.active,
      name: user.name,
      email: user.email
    } 
  });
};

// for-Signup
exports.signup = (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  User.findOne({email:email},async (err, docs)=>{
    if(!docs){
      const newUser =await User.create({
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
      });
      createSendToken(newUser, 201, res);
    }
    else if(err){
      return err;
    }
    else{
      return res.status(409).json({error:"duplicateUser", message:"user already exists"});
    }
  });
};

// for- Login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("please provide email or password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  // if(!user.confirmed){
  //   return res.status(401).json({message:"please confirm your email to login(check email)"});
  // }

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);
};

// Specific Middleware- Check If User Login or not
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in! Please login", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  req.user = currentUser;
  next();
});

// Specific Middleware- For Admin, Prime-User
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

// If User Forgot Password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with the given email", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a new Password to ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token send to email",
    });
  } catch (err) {
    (user.passwordResetToken = undefined),
      (user.passwordResetExpires = undefined),
      await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending email. TRY AGAIN LATER"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is Invalid or Expired", 400));
  }

  (user.password = req.body.password),
    (user.passwordConfirm = req.body.passwordConfirm),
    (user.passwordResetToken = undefined),
    (user.passwordResetExpires = undefined),
    await user.save();

  createSendToken(user, 200, res);
});

//  If User Login And want to change his/her Password
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});
