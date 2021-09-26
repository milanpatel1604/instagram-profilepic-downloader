const User = require("../models/userModel");
const MoodChart = require("../models/MoodChartModal");
const UserPreference= require("../models/UserPreferencesModel");
const UserSession = require("../models/UserSessionsModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");


// function
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};



// If User-wants to change his/her Email & username but not password
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, "name", "email");

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 200,
    data: {
      user: updatedUser,
    },
  });
});

// If User-wants to get or change his/her User preferences
exports.updateUserPreference = catchAsync(async (req, res, next) => {

  const filteredBody = filterObj(req.body, "default_app_language", "dark_mode", "notifications_active", "DND_active");
  const updatedUserPreferences = await UserPreference.updateOne({user_id : req.user.id}, filteredBody, (err)=>{
    if(err){
      return res.json(400).json({status:400, message: err});
    }
  });

  res.status(200).json({
    status: 200,
    data: {
      user_preference: updatedUserPreferences,
    },
  });
});

exports.getUserPreference = catchAsync(async (req, res, next)=>{
  const getUserPreferences = await UserPreference.findOne({user_id : req.user.id}, (err)=>{
    if(err){
      return res.json(400).json({status:400, message: err});
    }
  });

  res.status(200).json({
    status: 200,
    data: {
      user_preference: getUserPreferences,
    },
  });
})

// If User-wants to get or change his/her User Sessions
exports.updateUserSessions = catchAsync(async (req, res, next) => {

  const filteredBody = filterObj(req.body, "total_breathe_sessions", "total_sleep_sessions", "total_relax_sessions", "total_meditation_sessions", "total_relax_music_played");
  const updatedUserSession = await UserSession.updateOne({user_id : req.user.id}, filteredBody, (err)=>{
    if(err){
      return res.json(400).json({status:400, message: err});
    }
  });

  res.status(200).json({
    status: 200,
    data: {
      user_session: updatedUserSession,
    },
  });
});

exports.getUserSessions = catchAsync(async (req, res, next)=>{
  const getUserSession = await UserSession.findOne({user_id : req.user.id}, (err)=>{
    if(err){
      return res.json(400).json({status:400, message: err});
    }
  });

  res.status(200).json({
    status: 200,
    data: {
      user_session: getUserSession,
    },
  });
})


//adding user mood
exports.addUserMood= catchAsync(async (req, res, next) => {
  await MoodChart.create({
    user_id: req.body.user_id,
    date: new Date(),
    mood: req.body.mood.toLowerCase()
  })
  res.status(200).json({status: 200})
});

// if user wants to delete his profile
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.deleteOne({_id : req.user.id}, (err)=>{
    if(err){
      return res.json(400).json({status:400, message: err});
    }
    console.log("user deleted")
  });
  await UserPreference.deleteOne({user_id : req.user.id}, (err)=>{
    if(err){
      return res.json(400).json({status:400, message: err});
    }
    console.log("UserPreference deleted")
  });
  await UserSession.deleteOne({user_id : req.user.id}, (err)=>{
    if(err){
      return res.json(400).json({status:400, message: err});
    }
    console.log("UserSession deleted")
  });
  res.status(204).json({
    status: "success",
    data: null,
  });
});