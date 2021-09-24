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
const MusicCategory=require('../models/MusicCategoriesModal');
const AppSection=require('../models/AppSectionsModel');
const SleepStory=require('../models/SleepStoriesModel');
const RelaxMelody=require('../models/relaxMelodiesModel');


const jwt = require("jsonwebtoken");


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

//GET /meditationTracks --admin tracks page (web)
exports.meditationTracksPage=(req, res)=>{
  res.sendFile(viewsFilePath+'/meditationTracks.html');
}

//GET /sleepTracks --admin tracks page (web)
exports.sleepTracksPage=(req, res)=>{
  res.sendFile(viewsFilePath+'/sleepTracks.html');
}

//GET /relaxTracks --admin tracks page (web)
exports.relaxTracksPage=(req, res)=>{
  res.sendFile(viewsFilePath+'/relaxTracks.html');
}

//GET /LiveTracks --admin tracks page (web)
exports.liveTracksPage=(req, res)=>{
  res.sendFile(viewsFilePath+'/liveTracks.html');
}

//GET /notification --admin tracks page (web)
exports.notificationPage=(req, res)=>{
  res.sendFile(viewsFilePath+'/notification.html');
}


// For Admin-Specific:
async function getCategoryNameOrId(section_id, category_id, category_name) {
  if(!category_name){
    const result=await MusicCategory.findById(category_id, (err)=>{
      if(err){
        res.json("Something went wrong: "+err);
      }
    });
    return result.category_name;
  }
  else{
    const result=await MusicCategory.findOne({section_id: section_id, category_name:category_name}, (err)=>{
      if(err){
        res.json("Something went wrong: "+err);
      }
    });
    return result._id;
  }
}

async function getSectionNameOrId(section_id, section_name) {
  if(!section_name){
    const result=await AppSection.findById(section_id, (err)=>{
      if(err){
        res.json("Something went wrong: "+err);
      }
    });
    return result.section_name;
  }
  else{
    const result=await AppSection.findOne({section_name:section_name}, (err)=>{
      if(err){
        res.json("Something went wrong: "+err);
      }
    });
    return result._id;
  }
}

exports.addAppSection=async (req, res)=>{
  const sectionName=req.body.section_name;
  const sectionDescription=req.body.section_description;
  const newSection=await AppSection.create({
    section_name: sectionName,
    section_description: sectionDescription
  }, (err)=>{
    return res.status(400).json(err);
  })
  res.status(201).json({section_id: newSection._id, section_name: sectionName});
}

exports.addMusicCategory=async (req, res)=>{
  const sectionName=req.body.section_name;
  const categoryName=req.body.category_name;
  const section_id=await getSectionNameOrId(null, sectionName);
  const newCategory=await MusicCategory.create({
    section_id: section_id,
    category_name: categoryName
  }, (err)=>{
    return res.status(400).json(err);
  })
  res.status(201).json({category_id: newCategory._id, category_name: categoryName});
}


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


// Specific Middleware- Check If admin Login or not
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

//login check
exports.check=async (req, res)=>{
  res.status(200).json({status:200});
}

//logout
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

//GET /getMeditationTracks --admin tracks page (web)
exports.getMeditationTracks = catchAsync(async (req, res, next) => {
  const tracks = await MeditationTrack.find()
  console.log(tracks.category_id);
    res.status(200).json({
      status: 200,
      results: tracks.length,
      data: {
        tracks,
      },
    });
});

//GET /getSleepTracks --admin tracks page (web)
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

//GET /getRelaxTracks --admin tracks page (web)
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
//GET /getRelaxMelodySounds --admin tracks page (web)
exports.getRelaxMelodySounds = catchAsync(async (req, res, next) => {
    const tracks = await RelaxMelody.find()
    res.status(200).json({
      status: 200,
      results: tracks.length,
      data: {
        tracks,
      },
    });
});

//GET /getLiveTracks --admin tracks page (web)
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

//GET /getNotifications --admin tracks page (web)
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
exports.uploadMeditationTrack = async (req, res, next) => {
  const { title, artist, category, description, premium} =await req.body;
  if(req.files){
    //audio
    let audio=req.files.audioFile;
    let audioFileName=audio.name;
    const audioArr=audioFileName.split(".");
    const audioExtention=audioArr[audioArr.length-1];
    let audioExtentionsArr=['mp3', 'wav'];
    //image
    let img=req.files.imageFile;
    let imageFileName=img.name;
    const imageArr=imageFileName.split(".");
    const imageExtention=imageArr[imageArr.length-1];
    let imageExtentionsArr=['png', 'jpg', 'jpeg'];
    if(audioExtentionsArr.includes(audioExtention) && imageExtentionsArr.includes(imageExtention)){
      var category_id_arr=[];
      const sectionId=await getSectionNameOrId(null, 'meditation');
      await Promise.all(Array(category).map(async (element) => {
        const categoryId=await getCategoryNameOrId(sectionId, null, element);
        category_id_arr.push(categoryId);
      }));
      console.log("array_db is this "+category_id_arr);
      const newMeditationTrack = await MeditationTrack.create({
        section_id: sectionId,
        category_id: category_id_arr,
        title: title,
        artist: artist,
        description: description,
        isPremium: premium,
        image_extention: imageExtention,
        track_extention: audioExtention
      },async (err, docs)=>{
        if(err){
          res.status(400).json({status:400, message: "details not saved"});
        }
        console.log(docs._id);
        await img.mv(staticFilePath+"/tracks/meditationImages/"+`${docs._id}.${imageExtention}`, (err)=>{
          if(err){
            res.status(400).json({status: "Error", error: "failed to upload track, plese try again"});
          }
        })
        await audio.mv(staticFilePath+"/tracks/meditationTracks/"+`${docs._id}.${audioExtention}`, (err)=>{
          if(err){
            return res.send({status: "Error", error: "failed to upload track, plese try again"});
          }
          else{
            res.redirect('/meditationTracks');
          }
        })
      })
    }else{
      return res.send({status: "error", error: "invalid file format", valid_audio_format: "[ mp3, wav]", valid_image_format: "[ png, jpg, jpeg]"});
    }
  }
};

//POST /uploadSleepTrack --admin tracks page (web)
exports.uploadSleepTrack = async (req, res, next) => {
  const { title, artist, category, description, premium, language, lessons} =await req.body;
  if(req.files){
    //audio
    let audio=req.files.audioFile;
    let audioFileName=audio.name;
    const audioArr=audioFileName.split(".");
    const audioExtention=audioArr[audioArr.length-1];
    let audioExtentionsArr=['mp3', 'wav'];
    //image
    let img=req.files.imageFile;
    let imageFileName=img.name;
    const imageArr=imageFileName.split(".");
    const imageExtention=imageArr[imageArr.length-1];
    let imageExtentionsArr=['png', 'jpg', 'jpeg'];
    if(audioExtentionsArr.includes(audioExtention) && imageExtentionsArr.includes(imageExtention)){
      //sleep story -- pending-----------------
      var category_id_arr=[];
      const sectionId=await getSectionNameOrId(null, 'sleep');
      await Promise.all(Array(category).map(async (element) => {
        const categoryId=await getCategoryNameOrId(sectionId, null, element);
        category_id_arr.push(categoryId);
      }));
      console.log("sleep array_db is this "+category_id_arr);
      const newSleepTrack = await SleepTrack.create({
        section_id: sectionId,
        category_id: category_id_arr,
        title: title,
        artist: artist,
        description: description,
        isPremium: premium,
        image_extention: imageExtention,
        track_extention: audioExtention
      },async (err, docs)=>{
        if(err){
          res.status(400).json({status:400, message: "details not saved"});
        }
        console.log(docs._id);
        await img.mv(staticFilePath+"/tracks/sleepImages/"+`${docs._id}.${imageExtention}`, (err)=>{
          if(err){
            res.status(400).json({status: "Error", error: "failed to upload track, plese try again"});
          }
        })
        await audio.mv(staticFilePath+"/tracks/sleepTracks/"+`${docs._id}.${audioExtention}`, (err)=>{
          if(err){
            return res.send({status: "Error", error: "failed to upload track, plese try again"});
          }
          else{
            res.redirect('/sleepTracks');
          }
        })
      })
    }
    else{
      return res.send({status: "error", error: "invalid file format", valid_audio_format: "[ mp3, wav]", valid_image_format: "[ png, jpg, jpeg]"});
    }
  }
};


//POST /uploadRelaxTrack --admin tracks page (web)
exports.uploadRelaxTrack = async (req, res, next) => {
  const { title, artist, category, description, premium} =await req.body;
  if(req.files){
    //audio
    let audio=req.files.audioFile;
    let audioFileName=audio.name;
    const audioArr=audioFileName.split(".");
    const audioExtention=audioArr[audioArr.length-1];
    let audioExtentionsArr=['mp3', 'wav'];
    //image
    let img=req.files.imageFile;
    let imageFileName=img.name;
    const imageArr=imageFileName.split(".");
    const imageExtention=imageArr[imageArr.length-1];
    let imageExtentionsArr=['png', 'jpg', 'jpeg'];
    if(audioExtentionsArr.includes(audioExtention) && imageExtentionsArr.includes(imageExtention)){
      var category_id_arr=[];
      const sectionId=await getSectionNameOrId(null, 'relax');
      await Promise.all(Array(category).map(async (element) => {
        const categoryId=await getCategoryNameOrId(sectionId, null, element);
        category_id_arr.push(categoryId);
      }));
      console.log("relax array_db is this "+category_id_arr);
      const newRelaxTrack = await RelaxTrack.create({
        section_id: sectionId,
        category_id: category_id_arr,
        title: title,
        artist: artist,
        description: description,
        isPremium: premium,
        image_extention: imageExtention,
        track_extention: audioExtention
      },async (err, docs)=>{
        if(err){
          res.status(400).json({status:400, message: "details not saved"});
        }
        console.log(docs._id);
        await img.mv(staticFilePath+"/tracks/relaxImages/"+`${docs._id}.${imageExtention}`, (err)=>{
          if(err){
            res.status(400).json({status: "Error", error: "failed to upload track, plese try again"});
          }
        })
        await audio.mv(staticFilePath+"/tracks/relaxTracks/"+`${docs._id}.${audioExtention}`, (err)=>{
          if(err){
            return res.send({status: "Error", error: "failed to upload track, plese try again"});
          }
          else{
            res.redirect('/relaxTracks');
          }
        })
      })
    }else{
      return res.send({status: "error", error: "invalid file format", valid_audio_format: "[ mp3, wav]", valid_image_format: "[ png, jpg, jpeg]"});
    }
  }
};
//POST /uploadRelaxMelodySound --admin tracks page (web)
exports.uploadRelaxMelodySound = async (req, res, next) => {
  const {title, category} =await req.body;
  if(req.files){
    //audio
    let audio=req.files.audioFile;
    let audioFileName=audio.name;
    const audioArr=audioFileName.split(".");
    const audioExtention=audioArr[audioArr.length-1];
    let audioExtentionsArr=['mp3', 'wav'];
    if(audioExtentionsArr.includes(audioExtention)){
      const sectionId=await getSectionNameOrId(null, 'relax');
      const newRelaxMelodySound = await RelaxMelody.create({
        section_id: sectionId,
        sound_title: title,
        sound_category: category,
        track_extention: audioExtention
      }, async (err, docs)=>{
        if(err){
          res.status(400).json({status:400, message: "details not saved"});
        }
        console.log(docs._id);
        await audio.mv(staticFilePath+"/tracks/relaxTracks/"+`${docs._id}.${audioExtention}`, (err)=>{
          if(err){
            return res.send({status: "Error", error: "failed to upload track, plese try again"});
          }
          else{
            res.redirect('/relaxTracks');
          }
        })
      })
    }else{
      return res.send({status: "error", error: "invalid file format", valid_audio_format: "[ mp3, wav]"});
    }
  }
};


//POST /uploadLiveTrack --admin tracks page (web)
exports.uploadLiveTrack = catchAsync(async (req, res, next) => {
  const { title, artist, description, date, startTime, endTime} =await req.body;
  if(req.files){
    //audio
    let audio=req.files.audioFile;
    let audioFileName=audio.name;
    const audioArr=audioFileName.split(".");
    const audioExtention=audioArr[audioArr.length-1];
    let audioExtentionsArr=['mp3', 'wav'];
    //image
    let img=req.files.imageFile;
    let imageFileName=img.name;
    const imageArr=imageFileName.split(".");
    const imageExtention=imageArr[imageArr.length-1];
    let imageExtentionsArr=['png', 'jpg', 'jpeg'];
    if(audioExtentionsArr.includes(audioExtention) && imageExtentionsArr.includes(imageExtention)){
      const newLiveTrack = await LiveTrack.create({
        title: title,
        artist: artist,
        description: description,
        date: date,
        startTime: startTime,
        endTime: endTime,
        image_extention: imageExtention,
        track_extention: audioExtention
      },async (err, docs)=>{
        if(err){
          res.status(400).json({status:400, message: "details not saved"});
        }
        console.log(docs._id);
        await img.mv(staticFilePath+"/tracks/liveImages/"+`${docs._id}.${imageExtention}`, (err)=>{
          if(err){
            res.status(400).json({status: "Error", error: "failed to upload track, plese try again"});
          }
        })
        await audio.mv(staticFilePath+"/tracks/liveTracks/"+`${docs._id}.${audioExtention}`, (err)=>{
          if(err){
            return res.send({status: "Error", error: "failed to upload track, plese try again"});
          }
          else{
            res.redirect('/liveTracks');
          }
        })
      })
    }else{
      return res.send({status: "error", error: "invalid file format", valid_audio_format: "[ mp3, wav]", valid_image_format: "[ png, jpg, jpeg]"});
    }
  }
});

//POST /uploadNotification --admin tracks page (web)
exports.uploadNotification = catchAsync(async (req, res, next) => {
  const { message, date, premium} =await req.body;
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
  try{
    await fs.unlinkSync(staticFilePath+"/tracks/meditationTracks/"+`${_id}.mp3`,async (err)=>{
      await res.status(400).json({status:400, message: "track audio file not deleted"});
    });
  }catch(err){
    await fs.unlinkSync(staticFilePath+"/tracks/meditationTracks/"+`${_id}.wav`,async (err)=>{
      await res.status(400).json({status:400, message: "track audio file not deleted"});
    });
  }

  try{
    await fs.unlinkSync(staticFilePath+"/tracks/meditationImages/"+`${_id}.jpg`,async (err)=>{
      await res.status(400).json({status:400, message: "track image file not deleted"});
    })
  }catch(err){
    try {
      await fs.unlinkSync(staticFilePath+"/tracks/meditationImages/"+`${_id}.png`,async (err)=>{
        await res.status(400).json({status:400, message: "track image file not deleted"});
      })
    } catch (err) {
      await fs.unlinkSync(staticFilePath+"/tracks/meditationImages/"+`${_id}.jpeg`,async (err)=>{
        await res.status(400).json({status:400, message: "track image file not deleted"});
      })
    }
  }
  const result = await MeditationTrack.deleteOne({_id:_id},async (err)=>{
    if(err){
      await res.send({status:'Error', message: "track not deleted try again"});
    }
    else{
      await res.status(200).json({status:200, message:"Track deleted successfully"});
    }
  })
  console.log(result);
  console.log(_id +"deleted");
});

exports.sleepTrackDelete = catchAsync(async (req, res, next) => {
  const _id=await req.params.id;
  try{
    await fs.unlinkSync(staticFilePath+"/tracks/sleepTracks/"+`${_id}.mp3`,async (err)=>{
      await res.status(400).json({status:400, message: "track audio file not deleted"});
    });
  }catch(err){
    await fs.unlinkSync(staticFilePath+"/tracks/sleepTracks/"+`${_id}.wav`,async (err)=>{
      await res.status(400).json({status:400, message: "track audio file not deleted"});
    });
  }

  try{
    await fs.unlinkSync(staticFilePath+"/tracks/sleepImages/"+`${_id}.jpg`,async (err)=>{
      await res.status(400).json({status:400, message: "track image file not deleted"});
    })
  }catch(err){
    try {
      await fs.unlinkSync(staticFilePath+"/tracks/sleepImages/"+`${_id}.png`,async (err)=>{
        await res.status(400).json({status:400, message: "track image file not deleted"});
      })
    } catch (err) {
      await fs.unlinkSync(staticFilePath+"/tracks/sleepImages/"+`${_id}.jpeg`,async (err)=>{
        await res.status(400).json({status:400, message: "track image file not deleted"});
      })
    }
  }
  const result = await SleepTrack.deleteOne({_id:_id},async (err)=>{
    if(err){
      await res.send({status:'Error', message: "track not deleted try again"});
    }
    else{
      await res.status(200).json({status:200, message:"Track deleted successfully"});
    }
  })
  console.log(result);
  console.log(_id +"deleted");
});

exports.relaxTrackDelete = catchAsync(async (req, res, next) => {
  const _id=await req.params.id;
  try{
    await fs.unlinkSync(staticFilePath+"/tracks/relaxTracks/"+`${_id}.mp3`,async (err)=>{
      await res.status(400).json({status:400, message: "track audio file not deleted"});
    });
  }catch(err){
    await fs.unlinkSync(staticFilePath+"/tracks/relaxTracks/"+`${_id}.wav`,async (err)=>{
      await res.status(400).json({status:400, message: "track audio file not deleted"});
    });
  }

  try{
    await fs.unlinkSync(staticFilePath+"/tracks/relaxImages/"+`${_id}.jpg`,async (err)=>{
      await res.status(400).json({status:400, message: "track image file not deleted"});
    })
  }catch(err){
    try {
      await fs.unlinkSync(staticFilePath+"/tracks/relaxImages/"+`${_id}.png`,async (err)=>{
        await res.status(400).json({status:400, message: "track image file not deleted"});
      })
    } catch (err) {
      await fs.unlinkSync(staticFilePath+"/tracks/relaxImages/"+`${_id}.jpeg`,async (err)=>{
        await res.status(400).json({status:400, message: "track image file not deleted"});
      })
    }
  }
  const result = await RelaxTrack.deleteOne({_id:_id},async (err)=>{
    if(err){
      await res.send({status:'Error', message: "track not deleted try again"});
    }
    else{
      await res.status(200).json({status:200, message:"Track deleted successfully"});
    }
  })
  console.log(result);
  console.log(_id +"deleted");
});
exports.relaxMelodySoundDelete = catchAsync(async (req, res, next) => {
  const _id=await req.params.id;
  try{
    await fs.unlinkSync(staticFilePath+"/tracks/relaxTracks/"+`${_id}.mp3`,async (err)=>{
      await res.status(400).json({status:400, message: "track audio file not deleted"});
    });
  }catch(err){
    await fs.unlinkSync(staticFilePath+"/tracks/relaxTracks/"+`${_id}.wav`,async (err)=>{
      await res.status(400).json({status:400, message: "track audio file not deleted"});
    });
  }
  const result = await RelaxMelody.deleteOne({_id:_id},async (err)=>{
    if(err){
      await res.send({status:'Error', message: "track not deleted try again"});
    }
    else{
      await res.status(200).json({status:200, message:"Track deleted successfully"});
    }
  })
  console.log(result);
  console.log(_id +" deleted");
});

exports.liveTrackDelete = catchAsync(async (req, res, next) => {
  const _id=await req.params.id;
  try{
    await fs.unlinkSync(staticFilePath+"/tracks/liveTracks/"+`${_id}.mp3`,async (err)=>{
      await res.status(400).json({status:400, message: "track audio file not deleted"});
    });
  }catch(err){
    await fs.unlinkSync(staticFilePath+"/tracks/liveTracks/"+`${_id}.wav`,async (err)=>{
      await res.status(400).json({status:400, message: "track audio file not deleted"});
    });
  }

  try{
    await fs.unlinkSync(staticFilePath+"/tracks/liveImages/"+`${_id}.jpg`,async (err)=>{
      await res.status(400).json({status:400, message: "track image file not deleted"});
    })
  }catch(err){
    try {
      await fs.unlinkSync(staticFilePath+"/tracks/liveImages/"+`${_id}.png`,async (err)=>{
        await res.status(400).json({status:400, message: "track image file not deleted"});
      })
    } catch (err) {
      await fs.unlinkSync(staticFilePath+"/tracks/liveImages/"+`${_id}.jpeg`,async (err)=>{
        await res.status(400).json({status:400, message: "track image file not deleted"});
      })
    }
  }
  const result = await LiveTrack.deleteOne({_id:_id},async (err)=>{
    if(err){
      await res.send({status:'Error', message: "track not deleted try again"});
    }
    else{
      await res.status(200).json({status:200, message:"Track deleted successfully"});
    }
  })
  console.log(result);
  console.log(_id +"deleted");
});

exports.notificationDelete = catchAsync(async (req, res, next) => {
  const _id=await req.params.id;
  console.log(_id);
  const notificationDelete = await Notification.deleteOne({_id:_id},async (err)=>{
    if(err){
      await res.status(400).json({status:400, message: "message not deleted"});
    }
    else{
      await res.status(200).json({status:200, message:"message deleted successfully"});
    }
  })
  console.log(notificationDelete);
});