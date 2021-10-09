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

  const updatedUser = await User.updateOne({_id:req.user.id}, filteredBody, {
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


// if user wants to delete his profile
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

//adding user mood
exports.addUserMood = catchAsync(async (req, res, next) => {

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + '/' + mm + '/' + yyyy;
  console.log("Get current date - " + today)

  var happycount = 0;
  var amazingcount = 0;

  if(req.body.mood.toLowerCase() === "happy") {
    happycount += 1;
  }

  if(req.body.mood.toLowerCase() === "amazing") {
    amazingcount += 1;
  }

  const mood_chart = await MoodChart.find({
    user_id: req.user.id, 
    date: today
  })

  if(mood_chart.length == 0) {

    await MoodChart.create({
      user_id: req.user.id,
      date: today,
      timestamp: new Date(),
      mood: req.body.mood.toLowerCase(),
      noOfHappyDays: happycount,
      noOfAmazingDays: amazingcount
    })

    res.status(200).json({status: 200})

  }

  if(mood_chart.mood === "happy") {

    happycount = happycount + parseInt(mood_chart.noOfHappyDays) - 1;

  } else if(mood_chart.mood === "amazing") {

    amazingcount = amazingcount + parseInt(mood_chart.noOfAmazingDays) - 1;

  } else {

    happycount += parseInt(mood_chart.noOfHappyDays);

    amazingcount += parseInt(mood_chart.noOfAmazingDays);

  }
  
  await MoodChart.updateOne(
    {user_id: req.user.id,
    date: today},

    {timestamp: new Date(),
    mood: req.body.mood.toLowerCase(),
    noOfHappyDays: happycount,
    noOfAmazingDays: amazingcount}
  )

  return res.status(200).json({status: 200})
  
});

//getting user mood
exports.getUserMood= catchAsync(async (req, res, next) => {

  try {

    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date();

    console.log("First Day - " + firstDay);
    console.log("Last Day - " + lastDay);

    const transactions = await MoodChart.find({
        user_id: req.user.id,
        timestamp: {
          $gte: firstDay,
          $lte: lastDay
        }
      }).sort({ date: 'asc'})  
 
  if(!transactions) {
    return res.status(404).json({
      status:'failure',
      message:'Could not retrieve transactions'
    })
  }
  var jsonObj = [];
  
  transactions.forEach((element) => {
    jsonObj.push({"date":element.date,"mood":element.mood})
  })


 res.status(200).json({
 status:'success',
 data: jsonObj
    })
 
 } catch(error) {
   return res.status(500).json({
      status:'failure',
      error: error.message
    })
  }

});

exports.updusersubinfo = catchAsync(async (req, res, next) => {

  try {

    console.log("Subscription Duration - " + req.body.duration);
    console.log("Subscription promo code - " + req.body.promocode);

    var durationint = 0;
    var freepremium = false;
    var freepremiumavailable = true;

    if(req.body.duration === "YEARLY") {
      durationint = 12;
    } else if(req.body.duration === "MONTHLY") {
      durationint = 1;
    } else if(req.body.duration === "HALF YEARLY") {
      durationint = 6;
      freepremium = true;
      freepremiumavailable = false;
    } else {
      return res.status(401).json({
        status:'failure',
        error: 'Enter Valid Duration'
      })
    }

    var firstDay = new Date();

    var lastDay = new Date();
    var numberOfDaysToAdd = 28 * durationint;
    lastDay.setDate(lastDay.getDate() + numberOfDaysToAdd); 

    console.log("First Day - " + firstDay);
    console.log("Last Day - " + lastDay);

    var dd = String(firstDay.getDate()).padStart(2, '0');
    var mm = String(firstDay.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = firstDay.getFullYear();

    var dd2 = String(lastDay.getDate()).padStart(2, '0');
    var mm2 = String(lastDay.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy2 = lastDay.getFullYear();

    startday = dd + '/' + mm + '/' + yyyy;
    endday = dd2 + '/' + mm2 + '/' + yyyy2;

    const subscriptions = await UserSubscription.find({
        user_id: req.user.id,
    })

    if(!subscriptions[0]) {
      const subscription_create = await UserSubscription.create({
        subscription_id: req.body.subscriptionid,
        user_id: req.user.id,
        premium_user: "true",
        subscription_type: req.body.duration,
        subscription_validity: numberOfDaysToAdd,
        start_date: startday,
        start_date_timestamp: firstDay,
        end_date: endday,
        end_date_timestamp: lastDay,
        free_premium: freepremium,
        free_premium_available: freepremiumavailable,
        promotional_code_applied: req.body.promocode,
      })

      return res.status(200).json({
        status:'success',
        data: subscription_create
      })

    } 

    if(subscriptions[0].start_date_timestamp <= firstDay && subscriptions[0].end_date_timestamp >= firstDay) {
      return res.status(401).json({
        status:'failure',
        error: 'User already premium'
      })
    } 

    const subscription_update = await UserSubscription.updateOne(
      {
        user_id: req.user.id
      },
      {
        subscriptionid: req.body.subscriptionid,
        premium_user: "true",
        subscription_type: req.body.duration,
        subscription_validity: numberOfDaysToAdd,
        start_date: startday,
        start_date_timestamp: firstDay,
        end_date: endday,
        end_date_timestamp: lastDay,
        free_premium: freepremium,
        free_premium_available: freepremiumavailable,
        promotional_code_applied: req.body.promocode,
      }
    )
    
    return res.status(200).json({
      status:'success',
      data: subscription_update
    })
 

  
 } catch(error) {
    return res.status(500).json({
      status:'failure',
      error: error.message
    })
  }
});

exports.setusersubinfo = catchAsync(async (req, res, next) => {

  try {

    console.log("Subscription Duration - " + req.body.duration);
    console.log("Subscription promo code - " + req.body.promocode);

    var durationint = 0;
    var freepremium = false;
    var freepremiumavailable = true;

    if(req.body.duration === "YEARLY") {
      durationint = 12;
    } else if(req.body.duration === "MONTHLY") {
      durationint = 1;
    } else if(req.body.duration === "HALF YEARLY") {
      durationint = 6;
      freepremium = true;
      freepremiumavailable = false;
    } else {
      return res.status(401).json({
        status:'failure',
        error: 'Enter Valid Duration'
      })
    }

    var firstDay = new Date();

    var lastDay = new Date();
    var numberOfDaysToAdd = 28 * durationint;
    lastDay.setDate(lastDay.getDate() + numberOfDaysToAdd); 

    console.log("First Day - " + firstDay);
    console.log("Last Day - " + lastDay);

    var dd = String(firstDay.getDate()).padStart(2, '0');
    var mm = String(firstDay.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = firstDay.getFullYear();

    var dd2 = String(lastDay.getDate()).padStart(2, '0');
    var mm2 = String(lastDay.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy2 = lastDay.getFullYear();

    startday = dd + '/' + mm + '/' + yyyy;
    endday = dd2 + '/' + mm2 + '/' + yyyy2;

    const subscriptions = await UserSubscription.find({
        user_id: req.user.id,
    })

    if(!subscriptions[0]) {
      const subscription_create = await UserSubscription.create({
        subscription_id: req.body.subscriptionid,
        user_id: req.user.id,
        premium_user: "true",
        subscription_type: req.body.duration,
        subscription_validity: numberOfDaysToAdd,
        start_date: startday,
        start_date_timestamp: firstDay,
        end_date: endday,
        end_date_timestamp: lastDay,
        free_premium: freepremium,
        free_premium_available: freepremiumavailable,
        promotional_code_applied: req.body.promocode,
      })

      return res.status(200).json({
        status:'success',
        data: subscription_create
      })

    } 

    if(subscriptions[0].start_date_timestamp <= firstDay && subscriptions[0].end_date_timestamp >= firstDay) {
      return res.status(401).json({
        status:'failure',
        error: 'User already premium'
      })
    } 

    const subscription_update = await UserSubscription.updateOne(
      {
        user_id: req.user.id
      },
      {
        subscriptionid: req.body.subscriptionid,
        premium_user: "true",
        subscription_type: req.body.duration,
        subscription_validity: numberOfDaysToAdd,
        start_date: startday,
        start_date_timestamp: firstDay,
        end_date: endday,
        end_date_timestamp: lastDay,
        free_premium: freepremium,
        free_premium_available: freepremiumavailable,
        promotional_code_applied: req.body.promocode,
      }
    )
    
    return res.status(200).json({
      status:'success',
      data: subscription_update
    })
 

  
 } catch(error) {
    return res.status(500).json({
      status:'failure',
      error: error.message
    })
  }


});

exports.updateusersubinfo = catchAsync(async (req, res, next) => {

  try {
 
    const subscription_update = await UserSubscription.updateOne(
      {
        user_id: req.user.id
      },
      {
        premium_user: "false",
      }
    )
    
    return res.status(200).json({
      status:'success',
      data: subscription_update
    })
 
 } catch(error) {
    return res.status(500).json({
      status:'failure',
      error: error.message
    })
  }


});

exports.getusersubinfo = catchAsync(async (req, res, next) => {

  try {

    var firstDay = new Date();

    console.log("First Day - " + firstDay);

    const subscriptions = await UserSubscription.find({
        user_id: req.user.id,
    }) 
 
    
    return res.status(200).json({
      status:'success',
      data: subscriptions
    })
         
  } catch(error) {
    return res.status(500).json({
      status:'failure',
      error: error.message
    })
  }


});

exports.setUserReminder = catchAsync(async (req, res, next) => {

  try {

    console.log(req.body.date);
    console.log(req.body.time);
    console.log(req.body.text);
    console.log(req.user.id);

    var parts = (req.body.date).split('/');

    var firstDay = new Date(parts[2], parts[1] - 1, parts[0]);

    firstDay.setHours(0,0,0);

    console.log("First Day - " + firstDay);

    const reminders = await UserReminder.create({
      user_id: req.user.id,
      reminder_date: req.body.date,
      reminder_title: req.body.text,
      reminder_time: req.body.time,
      is_active: true,
      reminder_timestamp: firstDay,
    }) 

    return res.status(200).json({
      status:'success',
      data: reminders
    })

  } catch(error) {

    return res.status(500).json({
      status:'failure',
      error: error.message
    })

  }

});  
exports.getUserReminder = catchAsync(async (req, res, next) => {

  try {

    var firstDay = new Date();
    firstDay.setDate(firstDay.getDate() - (firstDay.getDay() + 6) % 7);

    var lastDay = new Date();
    lastDay.setDate(lastDay.getDate() + ((7 - lastDay.getDay()) % 7) % 7);

    console.log(firstDay)
    console.log(lastDay)

    const reminders = await UserReminder.find({
      user_id: req.user.id,
      reminder_timestamp: {
        $gte: firstDay,
        $lte: lastDay
      }
    }).sort({ reminder_date: 'asc'}) 

    return res.status(200).json({
      status:'success',
      data: reminders
    })

  } catch(error) {

    return res.status(500).json({
      status:'failure',
      error: error.message
    })

  }

});  
