const User = require("../models/userModel");
const MoodChart = require("../models/MoodChartModal");
const UserPreference= require("../models/UserPreferencesModel");

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

// If User-wants to change his/her User preferences
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
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});