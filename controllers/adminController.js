const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { promisify } = require("util");
require("dotenv").config();
const path=require('path');
var viewsFilePath= path.join(__dirname, '../views');

const User=require('../models/userModel');
const MeditationTrack=require('../models/MeditationTracksModel');
const RelaxTrack=require('../models/RelaxTracksModel');
const SleepTrack=require('../models/SleepTracksModel');
const LiveTrack=require('../models/LiveTracksModel');
const Notification=require('../models/NotificationsModel');

const jwt = require("jsonwebtoken");
const mongoose=require('mongoose');


//functions
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });
};
var token;
const createSendToken =async (user, statusCode, res) => {
    token =await signToken(user._id);
    return res.cookie('token', token,{
      expires: new Date(Date.now() + '3d'),
      secure: false,
      httpOnly: true,
    } ).json({status:statusCode, message:"login successful"})
};


//GET / --admin home page (web)
exports.homePage=(req, res)=>{
  res.sendFile(viewsFilePath+'/index.html');
}

//GET /login --admin login page (web)
exports.loginPage = (req, res)=>{
    res.sendFile(viewsFilePath + "/adminLogin.html");
}

//GET /users --admin users page (web)
exports.usersPage=(req, res)=>{
  res.sendFile(viewsFilePath+'/users.html');
}

//GET /meditationTracksPage --admin tracks page (web)
exports.meditationTracksPage=(req, res)=>{
  res.sendFile(viewsFilePath+'/meditationTracks.html');
}

//GET /tracks --admin tracks page (web)
exports.sleepTracksPage=(req, res)=>{
  res.sendFile(viewsFilePath+'/sleepTracks.html');
}

//GET /tracks --admin tracks page (web)
exports.relaxTracksPage=(req, res)=>{
  res.sendFile(viewsFilePath+'/relaxTracks.html');
}

//GET /tracks --admin tracks page (web)
exports.liveTracksPage=(req, res)=>{
  res.sendFile(viewsFilePath+'/liveTracks.html');
}

//GET /tracks --admin tracks page (web)
exports.notificationPage=(req, res)=>{
  res.sendFile(viewsFilePath+'/notification.html');
}


// For Admin-Specific:

//POST /authenticate --admin home page (web)
exports.loginVerification=async (req, res)=>{
    const email=req.body.emailValue;
    const password=req.body.passwordValue;
    console.log(email, password);
    const user =await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password)) || user.role !== "admin") {
        return res.status(400).json({status:400, error:"invalid username or password"});
    }

    createSendToken(user, 200, res);
}


// Specific Middleware- Check If User Login or not
exports.protect = catchAsync(async (req, res, next) => {

  const token=req.cookies.token || '';

  if (!token) {
    res.status(401).json({status:401, message:"Unauthorized Access please login"})
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

exports.check=async (req, res)=>{
  res.status(200).json({status:200});
}

exports.logout=async (req, res)=>{
  return res.cookie('token', token,{
    expires: new Date(Date.now()),
    secure: false,
    httpOnly: true,
  } ).json({status: 200, message:"logout successful"})
}


//GET /admin/getAllUsers --admin users page (web)
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
      status: 200,
      results: users.length,
      data: {
        users,
      },
    });
});

//GET /admin/getMeditationTracks --admin tracks page (web)
exports.getMeditationTracks = catchAsync(async (req, res, next) => {
  const tracks = await MeditationTrack.find()
    res.status(200).json({
      status: 200,
      results: tracks.length,
      data: {
        tracks,
      },
    });
});

//GET /admin/getSleepTracks --admin tracks page (web)
exports.getSleepTracks = catchAsync(async (req, res, next) => {
    const tracks = await SleepTrack.find()
    res.status(200).json({
      status: 200,
      results: tracks.length,
      data: {
        tracks,
      },
    });
});

//GET /admin/getRelaxTracks --admin tracks page (web)
exports.getRelaxTracks = catchAsync(async (req, res, next) => {
    const tracks = await RelaxTrack.find()
    res.status(200).json({
      status: 200,
      results: tracks.length,
      data: {
        tracks,
      },
    });
});

//GET /admin/getLiveTracks --admin tracks page (web)
exports.getLiveTracks = catchAsync(async (req, res, next) => {
    const tracks = await LiveTrack.find()
    res.status(200).json({
      status: 200,
      results: tracks.length,
      data: {
        tracks,
      },
    });
});

//GET /admin/getNotifications --admin tracks page (web)
exports.getNotifications = catchAsync(async (req, res, next) => {
    const notifications = await Notification.find()
    res.status(200).json({
      status: 200,
      results: notifications.length,
      data: {
        notifications,
      },
    });
});

//GET /admin/uploadMeditationTrack --admin tracks page (web)
exports.uploadMeditationTrack = catchAsync(async (req, res, next) => {
  const { title, artist, category, description, ispremium} = req.body;
  const MeditationTrack = await MeditationTrack.create({
    title: title,
    artist: artist,
    category: category,
    description: description,
    ispremium: ispremium
  })
});





// Not Working- For Admin Specific
exports.getUser = (req, res) => {
    res.status(500).json({
      status: "error",
      message: "This Route is not setup",
    });
  };
  
  exports.createUser = (req, res) => {
    res.status(500).json({
      status: "error",
      message: "This Route is not setup",
    });
  };
  
  exports.updateUser = (req, res) => {
    res.status(500).json({
      status: "error",
      message: "This Route is not setup",
    });
  };
  
  exports.deleteUser = (req, res) => {
    res.status(500).json({
      status: "error",
      message: "This Route is not setup",
    });
  };