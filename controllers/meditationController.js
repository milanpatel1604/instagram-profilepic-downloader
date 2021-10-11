const Meditation = require('../models/MeditationModel');
const User = require('../models/userModel');
const LiveTrack = require('../models/LiveTracksModel');
const MusicCategory = require('../models/MusicCategoriesModal');
const AppSection = require('../models/AppSectionsModel');
const MusicTrack = require('../models/MusicTracksModal');

const dotenv = require("dotenv").config();

const ObjectId = require('mongodb').ObjectID;

function checkId(object_id) {
    if (ObjectId.isValid(object_id)) {
        if ((String)(new ObjectId(object_id)) === object_id) {
            return true;
        }
        return false;
    }
    return false;
}

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
    const section_id = await getSectionNameOrId(null, 'meditation');
    await MusicTrack.find({ section_id: section_id }, async (err, docs) => {
        if (err) {
            return res.status(400).send({ status: 400, message: "Error: " + err });
        }
        if (!docs) {
            return res.status(410).send({ status: 410, message: "No data to show" });
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
        return res.status(200).json({ status: 200, response: result });
    })

};

exports.categorizedMeditationTracks = async (req, res) => {
    const section_id = await getSectionNameOrId(null, 'meditation');

    const beginners_id = await getCategoryNameOrId(section_id, null, 'beginners');
    const stress_id = await getCategoryNameOrId(section_id, null, 'stress');

    await MusicTrack.find({ section_id: section_id }, async (err, docs) => {
        if (err) {
            return res.status(400).json({ status: 400, error: err });
        }
        if (!docs) {
            return res.status(410).send({ status: 410, message: "No data to show" });
        }

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
        return res.status(200).json({ status: 200, results: result });
    })
}

exports.getMeditationTrack = async (req, res) => {
    const track_id = req.params.track_id;
    const user_id = req.user.id;
    if (!checkId(track_id)) {
        return res.status(444).json({ status: 444, error: "please provide a valid track_id in params" });
    }
    await MusicTrack.findOne({ _id: track_id }, async (err, docs) => {
        if (err) {
            return res.status(400).json({ status: 400, error: err });
        }
        if (!docs) {
            return res.status(410).send({ status: 410, message: "No data to show" });
        }
        await Meditation.findOne({ user_id: user_id, track_id: track_id }, async (err2, element) => {
            if (err2) {
                return res.status(403).json({ status: 403, error: err2 });
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
    if (!checkId(track_id)) {
        return res.status(444).json({ status: 444, error: "please provide a valid track_id in params" });
    }
    const favMeditation = await Meditation.updateOne({ user_id: user_id, track_id: track_id }, { is_favorite: true }, (err, docs) => {
        if (err) {
            return res.json(400).json({ status: 400, message: err });
        }
        if (!docs) {
            return res.status(410).send({ status: 410, message: "No data found" });
        }
    });
    return res.status(201).json({ status: 201, message: "Added Successfully" });
}

exports.getMeditationFavorite = async (req, res) => {
    const user_id = req.user.id;
    await Meditation.find({ user_id: user_id, is_favorite: true }, async (err, docs) => {

        if (err) {
            return res.status(400).json({ status: 400, error: err });
        }
        if (!docs) {
            return res.status(410).send({ status: 410, message: "data not found" });
        }
        var favTracks = [];
        await Promise.all(docs.map(async (item) => {
            const ress = await MusicTrack.findOne({ _id: item.track_id }, async (err) => {
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
        return res.status(200).json({ status: 200, results: favTracks });
    })
}

exports.removeMeditationFavorite = async (req, res) => {
    const user_id = req.user.id;
    const track_id = req.params.track_id;
    if (!checkId(track_id)) {
        return res.status(444).json({ status: 444, error: "please provide a valid track_id in params" });
    }
    const rmvFav = await Meditation.updateOne({ user_id: user_id, track_id: track_id }, { is_favorite: false }, (err, docs) => {
        if (err) {
            return res.json(400).json({ status: 400, message: err });
        }
        if (!docs) {
            return res.status(410).send({ status: 410, message: "No data to show" });
        }
        else {
            return res.status(202).json({ status: 202, message: "Removed Successfully" });
        }
    })
}

// Daily live meditation
exports.nextLiveTime = async (req, res) => {

    let date_ob = new Date();
    const presentDate = ("0" + date_ob.getDate()).slice(-2);
    const presentMonth = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    const presentYear = date_ob.getFullYear();

    const fullPresentDate = presentYear + "-" + presentMonth + "-" + presentDate;
    const presentHourinMinutes = date_ob.getHours() * 60;
    const presentMinutes = date_ob.getMinutes();
    console.log(presentHourinMinutes/60);
    const totalMinutes = presentMinutes + presentHourinMinutes;

    const todayLive = await LiveTrack.find({ date: fullPresentDate }, async (err) => {
        if (err) {
            return res.status(400).json({ status: 400, error: err });
        }
    })
    if (todayLive.length == 0) {
        return res.status(205).send({ status: 205, message: "No Live scheduled yet, check later" });
    }
    var allLiveTimeSlots = [];
    await todayLive.forEach(element => {
        var timeSlot = element.time_slot.split(":");
        var timeSlotInMinutes = Number(timeSlot[0]) * 60 + Number(timeSlot[1]);
        if (timeSlotInMinutes > totalMinutes) {
            allLiveTimeSlots.push(timeSlotInMinutes);
        }
    });
    var min = allLiveTimeSlots[0];
    allLiveTimeSlots.forEach(element => {
        if (Math.abs(element - totalMinutes) < Math.abs(min - totalMinutes)) {
            min = element;
        }
    });
    const nextLive=min/60;
    if(nextLive%1 === 0){
        return res.status(200).json({status:200, result:`${("0"+Number(nextLive)).slice(-2)}:00`});
    }
    else{
        return res.status(200).json({status:200, result:`${("0"+Math.floor(nextLive)).slice(-2)}:30`});
    }
}

exports.liveMeditation = async (req, res) => {

    let date_ob = new Date();
    const presentDate = ("0" + date_ob.getDate()).slice(-2);
    const presentMonth = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    const presentYear = date_ob.getFullYear();

    const fullPresentDate = presentYear + "-" + presentMonth + "-" + presentDate;
    const presentHour = ("0" + date_ob.getHours()).slice(-2);
    const presentMinutes = ("0" + date_ob.getMinutes()).slice(-2);

    if (presentMinutes < 30) {
        const live1 = await LiveTrack.findOne({ date: fullPresentDate, time_slot: `${presentHour}:00` }, async (err) => {
            if (err) {
                return res.status(400).json({ status: 400, error: err });
            }
        })
        if (!live1) {
            return res.status(202).send({ status: 202, message: "Not Live" });
        }
        console.log("hour unchanged");
        const timeSlot = await live1.time_slot.split(":");
        console.log(timeSlot[0], timeSlot[1]);
        return res.status(200).json({
            status: 200,
            live_id: live1._id,
            title: live1.title,
            artist: live1.artist,
            image_url: process.env.DOMAIN + `/static/tracks/liveImages/${live1._id}.${live1.image_extention}`,
            start_time: live1.time_slot,
            end_time: `${timeSlot[0]}:30`,
            current_status: `00:${presentMinutes}`
        })
    }
    if (presentMinutes >= 30) {
        const live2 = await LiveTrack.findOne({ date: fullPresentDate, time_slot: `${presentHour}:30` }, async (err) => {
            if (err) {
                return res.status(400).json({ status: 400, error: err });
            }
        })
        if (!live2) {
            return res.status(202).send({ status: 202, message: "Not Live" });
        }
        console.log("hour changed");
        const timeSlot = await live2.time_slot.split(":");
        console.log(timeSlot[0], timeSlot[1]);
        return res.status(200).json({
            status:200,
            live_id: live2._id,
            title: live2.title,
            artist: live2.artist,
            image_url: process.env.DOMAIN + `/static/tracks/liveImages/${live2._id}.${live2.image_extention}`,
            start_time: live2.time_slot,
            end_time: `${("0" + (Number(timeSlot[0]) + 1)).slice(-2)}:00`,
            current_status: `00:${("0" + (presentMinutes - 30)).slice(-2)}`
        })
    }
}

exports.getLiveTrack = async (req, res) => {
    const track_id = req.params.track_id;
    const user_id= req.user.id;
    if (!checkId(track_id)) {
        return res.status(444).json({ status: 444, error: "please provide a valid track_id in params" });
    }
    await Meditation.findOne({ user_id: user_id, live_id: track_id }, async (err2, element) => {
        if (err2) {
            return res.status(403).json({ status: 403, error: err2 });
        }
        if (!element) {
            const newMeditationUser = await Meditation.create({
                user_id: user_id,
                live_id: track_id._id,
            })
        }
    })
    await LiveTrack.findOne({ _id: track_id }, async (err, docs) => {
        if (err) {
            return res.status(400).json({ status: 400, error: err });
        }
        if (!docs) {
            return res.status(410).send({ status: 410, message: "track not available" });
        }
        return res.status(200).json({
            status: 200,
            track_url: process.env.DOMAIN + `/static/tracks/liveTracks/${docs._id}.${docs.track_extention}`,
            description: docs.description
        });
    })
}
