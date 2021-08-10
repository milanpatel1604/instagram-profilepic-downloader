const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { promisify } = require("util");
require("dotenv").config();
const path=require('path');
const fs=require('fs');
var staticFilePath=path.join(__dirname, '../static');
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


//POST /uploadMeditationTrack --admin tracks page (web)
exports.uploadMeditationTrack = catchAsync(async (req, res, next) => {
  const { title, artist, category, description, premium} =await req.body;
  console.log(premium);
  console.log(category);
  if(req.files){
    // console.log(req.files);
    var audio=req.files.audioFile;
    var audioFileName=audio.name;
    const audioArr=audioFileName.split(".");
    const audioExtention=audioArr[audioArr.length-1];
    await audio.mv(staticFilePath+"/tracks/meditationTracks/"+`${title}.${audioExtention}`, (err)=>{
      if(err){
        res.status(400).json({status: 400, message: "audio not uploaded"});
      }
      else{
        res.redirect('/meditationTracks');
      }
    })
    var img=req.files.imageFile;
    var imageFileName=img.name;
    const imageArr=imageFileName.split(".");
    const imageExtention=imageArr[imageArr.length-1];
    await img.mv(staticFilePath+"/tracks/meditationImages/"+`${title}.${imageExtention}`, (err)=>{
      if(err){
        res.status(400).json({status:400, message: "Image not uploaded"});
      }
    })
  }

  const newMeditationTrack = await MeditationTrack.create({
    title: title,
    artist: artist,
    category: category,
    description: description,
    isPremium: premium
  }, (err)=>{
    if(err){
      res.status(400).json({status:400, message: "details not saved"});
    }
  })
});

//POST /uploadSleepTrack --admin tracks page (web)
exports.uploadSleepTrack = catchAsync(async (req, res, next) => {
  const { title, artist, category, description, premium} =await req.body;
  console.log(premium);
  console.log(category);
  if(req.files){
    // console.log(req.files);
    var audio=req.files.audioFile;
    var audioFileName=audio.name;
    const audioArr=audioFileName.split(".");
    const audioExtention=audioArr[audioArr.length-1];
    await audio.mv(staticFilePath+"/tracks/sleepTracks/"+`${title}.${audioExtention}`, (err)=>{
      if(err){
        res.status(400).json({status: 400, message: "audio not uploaded"});
      }
      else{
        res.redirect('/sleepTracks');
      }
    })
    var img=req.files.imageFile;
    var imageFileName=img.name;
    const imageArr=imageFileName.split(".");
    const imageExtention=imageArr[imageArr.length-1];
    await img.mv(staticFilePath+"/tracks/sleepImages/"+`${title}.${imageExtention}`, (err)=>{
      if(err){
        res.status(400).json({status:400, message: "Image not uploaded"});
      }
    })
  }

  const newSleepTrack = await SleepTrack.create({
    title: title,
    artist: artist,
    category: category,
    description: description,
    isPremium: premium
  }, (err)=>{
    if(err){
      res.status(400).json({status:400, message: "details not saved"});
    }
  })
});

//POST /uploadRelaxTrack --admin tracks page (web)
exports.uploadRelaxTrack = catchAsync(async (req, res, next) => {
  const { title, artist, category, description, premium} =await req.body;
  console.log(premium);
  console.log(category);
  if(req.files){
    // console.log(req.files);
    var audio=req.files.audioFile;
    var audioFileName=audio.name;
    const audioArr=audioFileName.split(".");
    const audioExtention=audioArr[audioArr.length-1];
    await audio.mv(staticFilePath+"/tracks/relaxTracks/"+`${title}.${audioExtention}`, (err)=>{
      if(err){
        res.status(400).json({status: 400, message: "audio not uploaded"});
      }
      else{
        res.redirect('/relaxTracks');
      }
    })
    var img=req.files.imageFile;
    var imageFileName=img.name;
    const imageArr=imageFileName.split(".");
    const imageExtention=imageArr[imageArr.length-1];
    await img.mv(staticFilePath+"/tracks/relaxImages/"+`${title}.${imageExtention}`, (err)=>{
      if(err){
        res.status(400).json({status:400, message: "Image not uploaded"});
      }
    })
  }

  const newRelaxTrack = await RelaxTrack.create({
    title: title,
    artist: artist,
    category: category,
    description: description,
    isPremium: premium
  }, (err)=>{
    if(err){
      res.status(400).json({status:400, message: "details not saved"});
    }
  })
});

//POST /uploadLiveTrack --admin tracks page (web)
exports.uploadLiveTrack = catchAsync(async (req, res, next) => {
  const { title, artist, description, date, startTime, endTime} =await req.body;

  if(req.files){
    var audio=req.files.audioFile;
    var audioFileName=audio.name;
    const audioArr=audioFileName.split(".");
    const audioExtention=audioArr[audioArr.length-1];
    await audio.mv(staticFilePath+"/tracks/liveTracks/"+`${title}.${audioExtention}`, (err)=>{
      if(err){
        res.status(400).json({status: 400, message: "audio not uploaded"});
      }
      else{
        res.redirect('/liveTracks');
      }
    })
    var img=req.files.imageFile;
    var imageFileName=img.name;
    const imageArr=imageFileName.split(".");
    const imageExtention=imageArr[imageArr.length-1];
    await img.mv(staticFilePath+"/tracks/liveImages/"+`${title}.${imageExtention}`, (err)=>{
      if(err){
        res.status(400).json({status:400, message: "Image not uploaded"});
      }
    })
  }

  const newLiveTrack = await LiveTrack.create({
    title: title,
    artist: artist,
    description: description,
    date: date,
    startTime: startTime,
    endTime: endTime
  }, (err)=>{
    if(err){
      res.status(400).json({status:400, message: "details not saved"});
    }
  })
});

//POST /uploadNotification --admin tracks page (web)
exports.uploadNotification = catchAsync(async (req, res, next) => {
  const { message, date, premium} =await req.body;
  console.log(premium);
  console.log(date);
  console.log(message);
  const newNotification = await Notification.create({
    message: message,
    date: date,
    isPremium: premium
  }, (err)=>{
    if(err){
      res.status(400).json({status:400, message: "details not saved"});
    }
    else{
      res.redirect("/notification");
    }
  })
});

// delete functions:

exports.meditationTrackDelete = catchAsync(async (req, res, next) => {
  const _id=await req.params.id;
  console.log(_id);
  const trackData=await MeditationTrack.find({_id:_id}, (err)=>{
    if(err){
      res.redirect('/meditationTracks');
    }
  })
  const meditationTrackDelete = await MeditationTrack.deleteOne({_id:_id}, (err)=>{
    if(err){
      res.status(400).json({status:400, message: "track not deleted"});
    }
    else{
      res.status(200).json({status:200, message:"Track deleted successfully"});
    }
  })
  console.log(trackData);
  console.log(meditationTrackDelete);
  try{
    fs.unlinkSync(staticFilePath+"/tracks/meditationTracks/"+`${trackData[0].title}.mp3`, (err)=>{
      res.status(400).json({status:400, message: "track audio file not deleted"});
    });
  }catch(err){
    fs.unlinkSync(staticFilePath+"/tracks/meditationTracks/"+`${trackData[0].title}.wav`, (err)=>{
      res.status(400).json({status:400, message: "track audio file not deleted"});
    });
  }

  try{
    fs.unlinkSync(staticFilePath+"/tracks/meditationImages/"+`${trackData[0].title}.jpg`, (err)=>{
      res.status(400).json({status:400, message: "track image file not deleted"});
    })
  }catch(err){
    try {
      fs.unlinkSync(staticFilePath+"/tracks/meditationImages/"+`${trackData[0].title}.png`, (err)=>{
        res.status(400).json({status:400, message: "track image file not deleted"});
      })
    } catch (err) {
      fs.unlinkSync(staticFilePath+"/tracks/meditationImages/"+`${trackData[0].title}.jpeg`, (err)=>{
        res.status(400).json({status:400, message: "track image file not deleted"});
      })
    }
  }
});

exports.sleepTrackDelete = catchAsync(async (req, res, next) => {
  const _id=await req.params.id;
  console.log(_id);
  const trackData=await SleepTrack.find({_id:_id}, (err)=>{
    if(err){
      res.redirect('/sleepTracks');
    }
  })
  const sleepTrackDelete = await SleepTrack.deleteOne({_id:_id}, (err)=>{
    if(err){
      res.status(400).json({status:400, message: "track not deleted"});
    }
    else{
      res.status(200).json({status:200, message:"Track deleted successfully"});
    }
  })
  console.log(trackData);
  console.log(sleepTrackDelete);
  try{
    fs.unlinkSync(staticFilePath+"/tracks/sleepTracks/"+`${trackData[0].title}.mp3`, (err)=>{
      res.status(400).json({status:400, message: "track audio file not deleted"});
    });
  }catch(err){
    fs.unlinkSync(staticFilePath+"/tracks/sleepTracks/"+`${trackData[0].title}.wav`, (err)=>{
      res.status(400).json({status:400, message: "track audio file not deleted"});
    });
  }

  try{
    fs.unlinkSync(staticFilePath+"/tracks/sleepImages/"+`${trackData[0].title}.jpg`, (err)=>{
      res.status(400).json({status:400, message: "track image file not deleted"});
    })
  }catch(err){
    try {
      fs.unlinkSync(staticFilePath+"/tracks/sleepImages/"+`${trackData[0].title}.png`, (err)=>{
        res.status(400).json({status:400, message: "track image file not deleted"});
      })
    } catch (err) {
      fs.unlinkSync(staticFilePath+"/tracks/sleepImages/"+`${trackData[0].title}.jpeg`, (err)=>{
        res.status(400).json({status:400, message: "track image file not deleted"});
      })
    }
  }
});

exports.relaxTrackDelete = catchAsync(async (req, res, next) => {
  const _id=await req.params.id;
  console.log(_id);
  const trackData=await RelaxTrack.find({_id:_id}, (err)=>{
    if(err){
      res.redirect('/relaxTracks');
    }
  })
  const relaxTrackDelete = await RelaxTrack.deleteOne({_id:_id}, (err)=>{
    if(err){
      res.status(400).json({status:400, message: "track not deleted"});
    }
    else{
      res.status(200).json({status:200, message:"Track deleted successfully"});
    }
  })
  console.log(trackData);
  console.log(relaxTrackDelete);
  try{
    fs.unlinkSync(staticFilePath+"/tracks/relaxTracks/"+`${trackData[0].title}.mp3`, (err)=>{
      res.status(400).json({status:400, message: "track audio file not deleted"});
    });
  }catch(err){
    fs.unlinkSync(staticFilePath+"/tracks/relaxTracks/"+`${trackData[0].title}.wav`, (err)=>{
      res.status(400).json({status:400, message: "track audio file not deleted"});
    });
  }
  try{
    fs.unlinkSync(staticFilePath+"/tracks/relaxImages/"+`${trackData[0].title}.jpg`, (err)=>{
      res.status(400).json({status:400, message: "track image file not deleted"});
    })
  }catch(err){
    try {
      fs.unlinkSync(staticFilePath+"/tracks/relaxImages/"+`${trackData[0].title}.png`, (err)=>{
        res.status(400).json({status:400, message: "track image file not deleted"});
      })
    } catch (err) {
      fs.unlinkSync(staticFilePath+"/tracks/relaxImages/"+`${trackData[0].title}.jpeg`, (err)=>{
        res.status(400).json({status:400, message: "track image file not deleted"});
      })
    }
  }
});

exports.liveTrackDelete = catchAsync(async (req, res, next) => {
  const _id=await req.params.id;
  console.log(_id);
  const trackData=await LiveTrack.find({_id:_id}, (err)=>{
    if(err){
      res.redirect('/liveTracks');
    }
  })
  const liveTrackDelete = await LiveTrack.deleteOne({_id:_id}, (err)=>{
    if(err){
      res.status(400).json({status:400, message: "track not deleted"});
    }
    else{
      res.status(200).json({status:200, message:"Track deleted successfully"});
    }
  })
  console.log(trackData);
  console.log(liveTrackDelete);

  try{
    fs.unlinkSync(staticFilePath+"/tracks/liveTracks/"+`${trackData[0].title}.mp3`, (err)=>{
      res.status(400).json({status:400, message: "track audio file not deleted"});
    });
  }catch(err){
    fs.unlinkSync(staticFilePath+"/tracks/liveTracks/"+`${trackData[0].title}.wav`, (err)=>{
      res.status(400).json({status:400, message: "track audio file not deleted"});
    });
  }

  try{
    fs.unlinkSync(staticFilePath+"/tracks/liveImages/"+`${trackData[0].title}.jpg`, (err)=>{
      res.status(400).json({status:400, message: "track image file not deleted"});
    })
  }catch(err){
    try {
      fs.unlinkSync(staticFilePath+"/tracks/liveImages/"+`${trackData[0].title}.png`, (err)=>{
        res.status(400).json({status:400, message: "track image file not deleted"});
      })
    } catch (err) {
      fs.unlinkSync(staticFilePath+"/tracks/liveImages/"+`${trackData[0].title}.jpeg`, (err)=>{
        res.status(400).json({status:400, message: "track image file not deleted"});
      })
    }
  }
});

exports.notificationDelete = catchAsync(async (req, res, next) => {
  const _id=await req.params.id;
  console.log(_id);
  const notificationDelete = await Notification.deleteOne({_id:_id}, (err)=>{
    if(err){
      res.status(400).json({status:400, message: "message not deleted"});
    }
    else{
      res.status(200).json({status:200, message:"message deleted successfully"});
    }
  })
  console.log(notificationDelete);
});