const Meditation = require('../models/MeditationModel');
const User = require('../models/userModel');
const LiveTrack = require('../models/LiveTracksModel');
const MusicCategory= require('../models/MusicCategoriesModal');
const AppSection= require('../models/AppSectionsModel');
const MusicTrack = require('../models/MusicTracksModal');

const dotenv = require("dotenv").config();

//functions
// For Admin-Specific:
async function getCategoryNameOrId(section_id, category_id, category_name) {
    if (!category_name) {
        const result = await MusicCategory.findById(category_id, (err) => {
            if (err) {
                res.json("Something went wrong: " + err);
            }
        });
        return result.category_name;
    }
    else {
        const result = await MusicCategory.findOne({ section_id: section_id, category_name: category_name }, (err) => {
            if (err) {
                res.json("Something went wrong: " + err);
            }
        });
        return result._id;
    }
}

async function getSectionNameOrId(section_id, section_name) {
    if (!section_name) {
        const result = await AppSection.findById(section_id, (err) => {
            if (err) {
                res.json("Something went wrong: " + err);
            }
        });
        return result.section_name;
    }
    else {
        const result = await AppSection.findOne({ section_name: section_name }, (err) => {
            if (err) {
                res.json("Something went wrong: " + err);
            }
        });
        return result._id;
    }
}

//GET /allMeditationTracks --admin tracks page (web)
exports.allMeditationTracks = async (req, res, next) => {
    const section_id=await getSectionNameOrId(null, 'meditation');
    await MusicTrack.find({section_id: section_id}, async (err, docs) => {
      if(err){
        return res.status(400).send({status:400, message:"Error: "+err});
      }
      var result = [];
      await Promise.all(docs.map(async (element) => {
          await result.push({
              title: element.title,
              artist: element.artist,
              image_url: process.env.DOMAIN + `/static/tracks/musicImages/${element._id}.${element.image_extention}`,
              track_id: element._id,
              isPremium: element.isPremium
          })
      }))
      console.log(result);
      return res.status(200).json({ status: 200, response: result });
    })
    
};

exports.categorizedMeditationTracks = async (req, res) => {
    const section_id=await getSectionNameOrId(null, 'meditation');

    const beginners_id=await getCategoryNameOrId( section_id, null, 'beginners');
    const stress_id=await getCategoryNameOrId( section_id, null, 'stress');

    await MusicTrack.find({section_id: section_id}, async (err, docs) => {
        if (err) {
            return res.status(400).json({ status: 400, error: err });
        }

        console.log("section_id: "+ section_id + " has "+beginners_id, stress_id+" categories.");
        
        var result = [];
        var beginners = [];
        var stress = [];
        
        await Promise.all(docs.map(async (element) => {
            if (element.category_id.includes(beginners_id)) {
                await beginners.push({
                    title: element.title,
                    artist: element.artist,
                    image_url: process.env.DOMAIN + `/static/tracks/musicImages/${element._id}.${element.image_extention}`,
                    track_id: element._id,
                    isPremium: element.isPremium
                })
            }
            if (element.category_id.includes(stress_id)) {
                await stress.push({
                    title: element.title,
                    artist: element.artist,
                    image_url: process.env.DOMAIN + `/static/tracks/musicImages/${element._id}.${element.image_extention}`,
                    track_id: element._id,
                    isPremium: element.isPremium
                })
            }
        }))
        await result.push({
            Beginners: beginners,
            Stress: stress,
        })
        console.log(result);
        return res.status(200).json({ status: 200, response: result });
    })
}

exports.getMeditationTrack = async (req, res) => {
    const track_id = req.params.track_id;
    const user_id= req.user.id;
    await MusicTrack.findOne({ _id: track_id }, async (err, docs) => {
        if (err) {
            return res.status(400).json({ status: 400, error: err });
        }
        await Meditation.findOne({user_id: user_id, track_id: track_id},async (err2, element)=>{
            if (err2) {
                return res.status(403).json({status: 403, error: err2});
            }
            if (!element) {
                const newMeditationUser = await Meditation.create({
                    user_id: user_id,
                    track_id: track_id,
                })
            }
        })
        return res.status(200).json({
            track_url: process.env.DOMAIN + `/static/tracks/musicTracks/${docs._id}.${docs.track_extention}`,
            description: docs.description
        });
    })
}

//crud favorite
exports.addMeditationFavorite = async (req, res) => {
    const user_id = req.user.id;
    const track_id = req.params.track_id;
    const favMeditation = await Meditation.updateOne({user_id: user_id, track_id: track_id}, {is_favorite: true}, (err)=>{
        if(err){
          return res.json(400).json({status:400, message: err});
        }
    });
    return res.status(201).json({status:201, message: "Added Successfully"});
}

exports.getMeditationFavorite = async (req, res) => {
    const user_id = req.user.id;
    await Meditation.find({ user_id: user_id, is_favorite: true }, async (err, docs) => {

        if (err) {
            return res.status(400).json({ status: 400, error: err });
        }
        var favTracks = [];
        await Promise.all(docs.map(async (item) => {
            const ress=await MusicTrack.findOne({ _id: item.track_id }, async (err) => {
                if (err) {
                    return res.status(400).json({ status: 400, error: err });
                }
            })
            favTracks.push({
                title: ress.title,
                artist: ress.artist,
                image_url: process.env.DOMAIN + `/static/tracks/musicImages/${ress._id}.${ress.image_extention}`,
                track_id: ress._id,
                isPremium: ress.isPremium
            })
        }))
        return res.status(200).json({ status: 200, response: favTracks });
    })
}

exports.removeMeditationFavorite = async (req, res) => {
    const user_id = req.user.id;
    const track_id = req.params.track_id;
    const rmvFav = await Meditation.updateOne({ user_id: user_id, track_id: track_id }, {is_favorite: false}, (err) => {
        if (err) {
            res.json(400).json({ status: 400, message: err });
        }
        else {
            res.status(202).json({ status: 202, message: "Removed Successfully" });
        }
    })
    console.log(rmvFav);
}

// Daily live meditation
exports.allLiveTracks = (req, res) => {

    LiveTrack.find({}, async (err, docs) => {
        if (err) {
            return res.status(400).json({ status: 400, error: err });
        }
        console.log(docs);
        var result = [];
        docs.forEach(async (element) => {
            await result.push({
                title: element.title,
                artist: element.artist,
                image_url: process.env.DOMAIN + `/static/tracks/liveImages/${element._id}.${element.image_extention}`,
                date: element.date,
                startTime: element.startTime,
                endTime: element.endTime,
                track_duration: element.track_duration,
                track_id: element._id,
            })
        })
        return res.status(200).json({ status: 200, response: result });
    })
}

exports.liveMeditation = async (req, res)=>{
    let date_ob=new Date();
    const presentDate= ("0"+date_ob.getDate()).slice(-2);
    const presentMonth= ("0"+(date_ob.getMonth()+1)).slice(-2);
    const presentYear=date_ob.getFullYear();
    const fullPresentDate= presentYear+"-"+presentMonth+"-"+presentDate;
    const presentHour=date_ob.getHours();
    const presentMinutes=date_ob.getMinutes();

    LiveTrack.find({date: fullPresentDate}, async (err, docs) =>{
        for(let i=0;i<docs.length;i++){
            console.log(docs[i]);
            const startTime=docs[i].startTime.split(":");
            const endTime=docs[i].endTime.split(":");
            if(presentHour>=startTime[0] && presentHour<endTime[0]){
                if(presentMinutes>=startTime[1] && presentMinutes<endTime[1]){
                    console.log("hel")
                    res.status(200).json({
                        live_id: docs[i]._id,
                        title: docs[i].title,
                        artist: docs[i].artist,
                        image_url: process.env.DOMAIN + `/static/tracks/liveImages/${docs[i]._id}.${docs[i].image_extention}`,
                        current_status: pending___
                    })
                    console.log("track is live now");
                }
            }
        }
    })
}

exports.getLiveTrack = async (req, res) => {
    const track_id = req.params.track_id;
    await LiveTrack.findOne({ _id: track_id }, async (err, docs) => {
        if (err) {
            return res.status(400).json({ status: 400, error: err });
        }
        return res.status(200).json({
            track_url: process.env.DOMAIN + `/static/tracks/liveTracks/${docs._id}.${docs.track_extention}`,
            description: docs.description
        });
    })
}
