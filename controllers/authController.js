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

//google auth
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// functions
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  return res.status(statusCode).json({
    status: statusCode,
    token,
    data: {
      _id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
      email_verified: user.email_verified,
      login_using: user.login_using
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
      login_using: "email"
    });
    const token = user.createVerificationToken();
    await user.save({ validateBeforeSave: false });

    const message = `To verify your email Enter this OTP in the app : ${token}
    Expires in 2 minutes`;

    try {
      await sendEmail({
        email: user.email,
        subject: "your Email verification OTP (valid for 2 min)",
        message: message,
      })
      res.status(200).json({status: 200, message: "Mail sent successfully"})
    } catch (err) {
      console.log(err);
      (user.verificationToken = undefined),
        (user.verificationTokenExpiresAt = undefined),
        await user.save({ validateBeforeSave: false });

      return res.status(500).json({message:"There was an error sending email. TRY AGAIN LATER OR USE ANOTHER EMAIL"});
    }
  } catch (error) {
    if(error.code == 11000){
      return res.status(409).json({status: 409, message: "Email already exists"})
    }
    return res.status(402).json({status: 402, message: error});
  }
};

exports.resendVerifyEmailToken = async (req, res, next) => {
  const user =await User.findOne({
    email: req.body.email,
  });
  const token = user.createVerificationToken();
  await user.save({ validateBeforeSave: false });

  const message = `To verify your email Enter this OTP in the app : ${token}
  Expires in 2 minutes`;

  try {
    await sendEmail({
      email: user.email,
      subject: "your Email verification OTP (valid for 2 min)",
      message: message,
    })
    res.status(200).json({status: 200, message: "Mail sent successfully"})
  } catch (err) {
    console.log(err);
    (user.verificationToken = undefined),
      (user.verificationTokenExpiresAt = undefined),
      await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending email. TRY AGAIN LATER OR USE ANOTHER EMAIL"),
      500
    );
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
    return next(new AppError("please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  console.log(user);

  if (!user) {
    return next(new AppError("No user with this email, please signup", 404));
  }
  if(!user.password){
    return next(new AppError(`Please login using ${user.login_using} OR use another email`, 405));
  }
  if (!(await user.correctPassword(password, user.password))){
    return next(new AppError("Incorrect password", 401));
  }
  if(!user.email_verified){
    return next(new AppError("please verify your email to login(check email)", 402));
  }
  
  createSendToken(user, 200, res);
};

//login with google
exports.loginWithGoogle= async (req, res, next)=>{
  const token=req.body.token;
  try {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
        //if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    const user = await User.findOne({email: payload.email},async (err, doc)=>{
      if(err){
        return next(new AppError(`error:${err}`, 400));
      }
      if(!doc){
        const user =await User.create({
          name: payload.name,
          email: payload.email,
          email_verified: payload.email_verified,
          login_using: "google"
        })
        console.log('new user')
        await createSendToken( user, 200, res);
      }
      if(doc){
        console.log('already a user')
        await createSendToken( doc, 200, res);
      }
    })
  } catch(err) {
    return next(new AppError(`something went wrong(error: ${err})--please use another account or method to login or signup`, 401));
  } 
}

//login with facebook
exports.loginWithFacebook= async (req, res, next)=>{
  const token=req.body.token;
  // try {
  //   const ticket = await client.verifyIdToken({
  //       idToken: token,
  //       audience: process.env.GOOGLE_CLIENT_ID,
  //       //if multiple clients access the backend:
  //       //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  //   });
  //   const payload = ticket.getPayload();
  //   const userid = payload['sub'];
  //   const user = await User.findOne({email: payload.email},async (err, doc)=>{
  //     if(err){
  //       return next(new AppError(`error:${err}`, 400));
  //     }
  //     if(!doc){
  //       const user =await User.create({
  //         name: payload.name,
  //         email: payload.email,
  //         email_verified: payload.email_verified,
  //         login_using: "facebook"
  //       })
  //       console.log('new user')
  //       await createSendToken( user, 200, res);
  //     }
  //     if(doc){
  //       console.log('already a user')
  //       await createSendToken( doc, 200, res);
  //     }
  //   })
  // } catch(err) {
  //   return next(new AppError(`something went wrong(error: ${err})--please use another account or method to login or signup`, 401));
  // } 
}

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

exports.checkLogin= async (req,res)=>{
  console.log(req.user)
  createSendToken(req.user, 200, res)
}

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
    })
    res.status(200).json({status: 200, message: "Mail sent successfully"})
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
    return next(new AppError("Your current password is wrong.", 402));
  }

  user.password = req.body.password;
  await user.save();

  createSendToken(user, 200, res);
});
