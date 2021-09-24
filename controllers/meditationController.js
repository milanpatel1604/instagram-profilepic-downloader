const MeditationTrack = require('../models/MeditationTracksModel');
const User = require('../models/userModel');
const LiveTrack = require('../models/LiveTracksModel');
const MusicCategory= require('../models/MusicCategoriesModal');
const AppSection= require('../models/AppSectionsModel');

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


exports.allMeditationTracks = async (req, res) => {

    MeditationTrack.find({}, async (err, docs) => {
        if (err) {
            return res.status(400).json({ status: 400, error: err });
        }
        const section_id=await getSectionNameOrId(null, 'meditation');
        const beginners_id=await getCategoryNameOrId( section_id, null, 'beginners');
        const stress_id=await getCategoryNameOrId( section_id, null, 'stress');

        console.log("section_id: "+ section_id + " has "+beginners_id, stress_id+" categories.");
        
        var result = [];
        var beginners = [];
        var stress = [];
        
        await Promise.all(docs.map(async (element) => {
            if (element.category_id.includes(beginners_id)) {
                await beginners.push({
                    title: element.title,
                    artist: element.artist,
                    image_url: process.env.DOMAIN + `/static/tracks/meditationImages/${element._id}.${element.image_extention}`,
                    track_id: element._id,
                    isPremium: element.isPremium
                })
            }
            if (element.category_id.includes(stress_id)) {
                await stress.push({
                    title: element.title,
                    artist: element.artist,
                    image_url: process.env.DOMAIN + `/static/tracks/meditationImages/${element._id}.${element.image_extention}`,
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
        return res.status(200).json({ status: 200, results: result });
    })
}

exports.getMeditationTrack = async (req, res) => {
    const track_id = req.params.track_id;
    MeditationTrack.findOne({ _id: track_id }, async (err, docs) => {
        if (err) {
            return res.status(400).json({ status: 400, error: err });
        }
        return res.status(200).json({
            track_url: process.env.DOMAIN + `/static/tracks/meditationTracks/${docs._id}.${docs.track_extention}`,
            description: docs.description
        });
    })
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
        return res.status(200).json({ status: 200, results: result });
    })
}

exports.getLiveTrack = async (req, res) => {
    const track_id = req.params.track_id;
    LiveTrack.findOne({ _id: track_id }, async (err, docs) => {
        if (err) {
            return res.status(400).json({ status: 400, error: err });
        }
        return res.status(200).json({
            track_url: process.env.DOMAIN + `/static/tracks/liveTracks/${docs._id}.${docs.track_extention}`,
            description: docs.description
        });
    })
}

//userspecific
exports.addMeditationFavorite = async (req, res) => {
    const user_id = req.body.user_id;
    const track_id = req.body.track_id;
    const newFav = await User.updateOne({ _id: user_id }, {
        $push: {
            meditationFavorite_id: track_id
        }
    }, (err, docs) => {
        if (err) {
            res.json(400).json({ status: 400, message: err });
        }
        else {
            res.status(201).json({ status: 201, message: "Added Successfully" });
        }
    })
}

exports.getMeditationFavorite = async (req, res) => {
    const user_id = req.params.user_id;
    User.findOne({ _id: user_id }, async (err, docs) => {

        if (err) {
            return res.status(400).json({ status: 400, error: err });
        }

        var favTracks = [];
        for (let i = 0; i < docs.meditationFavorite_id.length; i++) {
            await MeditationTrack.findOne({ _id: docs.meditationFavorite_id[i] }, async (err, element) => {
                if (err) {
                    return res.status(400).json({ status: 400, error: err });
                }
                await favTracks.push({
                    title: element.title,
                    artist: element.artist,
                    image_url: process.env.DOMAIN + `/static/tracks/meditationImages/${element._id}.${element.image_extention}`,
                    track_id: element._id,
                    isPremium: element.isPremium
                })
            })
        }
        await console.log(favTracks);
        return res.status(200).json({ status: 200, results: favTracks });
    })
}

exports.removeMeditationFavorite = async (req, res) => {
    const user_id = req.body.user_id;
    const track_id = req.body.track_id;
    const rmvFav = await User.updateOne({ _id: user_id }, {
        $pull: {
            meditationFavorite_id: track_id
        }
    }, (err, docs) => {
        if (err) {
            res.json(400).json({ status: 400, message: err });
        }
        else {
            res.status(202).json({ status: 202, message: "Removed Successfully" });
        }
    })
}