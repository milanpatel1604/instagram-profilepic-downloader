const User = require("../models/userModel");
const MoodChart = require("../models/MoodChartModal");

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
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

// if user wants to delete his profile
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

//adding user mood
exports.addUserMood= catchAsync(async (req, res, next) => {
  await MoodChart.create({
    user_id: req.body.user_id,
    date: new Date(),
    mood: req.body.mood.toLowerCase()
  })
  res.status(200).json({status: 200})
});