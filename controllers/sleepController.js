const SleepTrack=require('../models/SleepTracksModel');
const User=require('../models/userModel');
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


exports.allSleepTracks=(req, res)=>{
    
    SleepTrack.find({}, async (err, docs)=>{
        if(err){
            return res.status(400).json({status: 400, error: err});
        }
        console.log(docs);
        var result=[];
        var music=[];
        var stories=[];
        var mysterious=[];

        const section_id=await getSectionNameOrId(null, 'sleep');
        const music_id=await getCategoryNameOrId( section_id, null, 'music');
        const stories_id=await getCategoryNameOrId( section_id, null, 'stories');
        const mysterious_id=await getCategoryNameOrId( section_id, null, 'mysterious');

        console.log("section_id: "+ section_id + " has "+music_id, stories_id, mysterious_id+" categories.");

        await Promise.all(docs.map(async (element)=>{
            if(element.category_id.includes(music_id)){
                await music.push({
                    title: element.title,
                    artist: element.artist,
                    image_url: process.env.DOMAIN + `/static/tracks/sleepImages/${element._id}.${element.image_extention}`,
                    track_id: element._id,
                    isPremium: element.isPremium
                })
            }
            if(element.category_id.includes(stories_id)){
                await stories.push({
                    title: element.title,
                    artist: element.artist,
                    image_url: process.env.DOMAIN + `/static/tracks/sleepImages/${element._id}.${element.image_extention}`,
                    track_id: element._id,
                    isPremium: element.isPremium
                })
            }
            if(element.category_id.includes(mysterious_id)){
                await mysterious.push({
                    title: element.title,
                    artist: element.artist,
                    image_url: process.env.DOMAIN + `/static/tracks/sleepImages/${element._id}.${element.image_extention}`,
                    track_id: element._id,
                    isPremium: element.isPremium
                })
            }
        }))
        await result.push({
            Music: music,
            Stories: stories,
            Mysterious: mysterious
        })
        return res.status(200).json({status:200, results: result});
    })
}

exports.getSleepTrack= async (req, res)=>{
    const track_id=req.params.track_id;
    SleepTrack.findOne({_id: track_id}, async (err, docs)=>{
        if(err){
            return res.status(400).json({status: 400, error: err});
        }
        return res.status(200).json({
            track_url: process.env.DOMAIN + `/static/tracks/sleepTracks/${docs._id}.${docs.track_extention}`,
            description: docs.description
        });
    })
}

//userspecific
exports.addSleepFavorite= async (req, res)=>{
    const user_id=req.body.user_id;
    const track_id=req.body.track_id;
    const newFav= await User.updateOne({_id: user_id}, {
        $push: {
            sleepFavorite_id:track_id
        }
    }, (err, docs)=>{
        if(err){
            res.json(400).json({status:400, message:err});
        }
        else{
            res.status(201).json({status:201, message: "Added Successfully"});
        }
    })
}

exports.getSleepFavorite=async (req, res)=>{
    const user_id=req.params.user_id;
    User.findOne({_id:user_id}, async (err, docs)=>{

        if(err){
            return res.status(400).json({status: 400, error: err});
        }
        
        var favTracks=[];
        for(let i=0; i<docs.sleepFavorite_id.length; i++){
            await SleepTrack.findOne({_id: docs.sleepFavorite_id[i]}, async (err, element)=>{
                if(err){
                    return res.status(400).json({status: 400, error: err});
                }
                await favTracks.push({
                    title: element.title,
                    artist: element.artist,
                    image_url: process.env.DOMAIN + `/static/tracks/sleepImages/${element._id}.${element.image_extention}`,
                    track_id: element._id,
                    isPremium: element.isPremium
                })
            })
        }
        await console.log(favTracks);
        return res.status(200).json({status:200, results: favTracks});
    })
}

exports.removeSleepFavorite= async (req, res)=>{
    const user_id=req.body.user_id;
    const track_id=req.body.track_id;
    const rmvFav=await User.updateOne({_id: user_id}, {
        $pull: {
            sleepFavorite_id:track_id
        }
    }, (err, docs)=>{
        if(err){
            res.json(400).json({status:400, message:err});
        }
        else{
            res.status(202).json({status:202, message: "Removed Successfully"});
        }
    })
}