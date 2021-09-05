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
      name: user.name,
      role: user.role,
      active: user.active,
      email: user.email,
      email_verified: user.email_verified
    } 
  });
};

// for-Signup
exports.signup =async (req, res, next) => {
  const { name, email, password} = req.body;
  try {
    const user =await User.create({
      name: name,
      email: email,
      password: password,
    });
    const token = user.createVerificationToken();
    await user.save({ validateBeforeSave: false });

    const message = `To verify your email Enter this OTP in the app : ${token}
    Expires in 5 minutes`;

    try {
      await sendEmail({
        email: user.email,
        subject: "your Email verification OTP (valid for 5 min)",
        message: message,
      }, (err, data)=>{
        if(err){
          res.status(400).json({status: 400, message: "there was an error sending mail"+err})
        }
        else{
          res.status(200).json({status: 200, message: "Mail sent successfully"})
        }
      });
    } catch (err) {
      console.log(err);
      (user.verificationToken = undefined),
        (user.verificationTokenExpiresAt = undefined),
        await user.save({ validateBeforeSave: false });

      return next(
        new AppError("There was an error sending email. TRY AGAIN LATER"),
        500
      );
    }
  } catch (error) {
    if(error.code == 11000){
      return res.status(409).json({status: 409, message: "Email already exists"})
    }
    return res.status(402).json({status: 402, message: error});
  }
};

//verify mail using otp(token) 
exports.varifyEmail = async(req, res, next)=>{
  const user =await User.findOne({
    email: req.body.email,
    verificationToken: req.body.token,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({status:400, message:"invalid otp or otp is experied"})
  }

  (user.email_verified = true),
  (user.verificationToken = undefined),
  (user.verificationTokenExpiresAt = undefined),
  await user.save();

  createSendToken( user, 201, res);
}

// for- Login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("please provide email or password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  
  if(!user.email_verified){
    return res.status(401).json({status:401, message:"please verify your email to login(check email)"});
  }
  
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

  const resetToken = user.createVerificationToken();
  await user.save({ validateBeforeSave: false });

  const message = `Forgot your password? reset using OTP: ${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "your password reset OTP (valid for 5 min)",
      message: message,
    }, (err, data)=>{
      if(err){
        res.status(400).json({status: 400, message: "there was an error sending mail"+err})
      }
      else{
        res.status(200).json({status: 200, message: "Mail sent successfully"})
      }
    });
  } catch (err) {
    console.log(err);
    (user.verificationToken = undefined),
      (user.verificationTokenExpiresAt = undefined),
      await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending email. TRY AGAIN LATER"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {

  const user = await User.findOne({
    verificationToken: req.body.token,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is Invalid or Expired", 400));
  }

  (user.password = req.body.password),
  (user.verificationToken = undefined),
  (user.verificationTokenExpiresAt = undefined),
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
  await user.save();

  createSendToken(user, 200, res);
});
