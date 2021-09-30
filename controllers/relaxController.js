const Relax=require('../models/RelaxModel');
const RelaxMelody=require('../models/relaxMelodiesModel');
const User=require('../models/userModel');
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
exports.allRelaxTracks = async (req, res, next) => {
    const section_id=await getSectionNameOrId(null, 'relax');
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

exports.categorizedRelaxTracks=async (req, res)=>{
    
    const section_id=await getSectionNameOrId(null, 'relax');

    const beginners_id=await getCategoryNameOrId( section_id, null, 'beginners');
    const self_calm_id=await getCategoryNameOrId( section_id, null, 'self-calm');

    MusicTrack.find({section_id: section_id}, async (err, docs)=>{
        if(err){
            return res.status(400).json({status: 400, error: err});
        }
        

        console.log("section_id: "+ section_id + " has "+beginners_id, self_calm_id+" categories.");
        console.log(docs);
        var result=[];
        var beginners=[];
        var self_calm=[];
        docs.forEach(async (element)=>{
            if(element.category_id.includes(beginners_id)){
                await beginners.push({
                    title: element.title,
                    artist: element.artist,
                    image_url: process.env.DOMAIN + `/static/tracks/musicImages/${element._id}.${element.image_extention}`,
                    track_id: element._id,
                    isPremium: element.isPremium
                })
            }
            if(element.category_id.includes(self_calm_id)){
                await self_calm.push({
                    title: element.title,
                    artist: element.artist,
                    image_url: process.env.DOMAIN + `/static/tracks/musicImages/${element._id}.${element.image_extention}`,
                    track_id: element._id,
                    isPremium: element.isPremium
                })
            }
        })
        await result.push({
            Beginners: beginners,
            'Self-Calm': self_calm,
        })
        return res.status(200).json({status:200, response: result});
    })
}

exports.getRelaxTrack= async (req, res)=>{
    const track_id=req.params.track_id;
    const user_id= req.user.id; 
    MusicTrack.findOne({_id: track_id}, async (err, docs)=>{
        if(err){
            return res.status(400).json({status: 400, error: err});
        }
        await Relax.findOne({user_id: user_id, track_id: track_id},async (err2, element)=>{
            if (err2) {
                return res.status(403).json({status: 403, error: err2});
            }
            if (!element) {
                const newRelaxUser = await Relax.create({
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
exports.addRelaxFavorite= async (req, res)=>{
    const user_id=req.user.id;
    const track_id=req.params.track_id;
    const favRelax = await Relax.updateOne({user_id: user_id, track_id: track_id}, {is_favorite: true}, (err, docs)=>{
        if(err){
          return res.json(400).json({status:400, message: err});
        }
    });
    return res.status(201).json({status:201, message: "Added Successfully"});
}

exports.getRelaxFavorite=async (req, res)=>{
    const user_id=req.user.id;
    await Relax.find({ user_id: user_id, is_favorite: true }, async (err, docs) => {

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

exports.removeRelaxFavorite= async (req, res)=>{
    const user_id = req.user.id;
    const track_id = req.params.track_id;
    const rmvFav = await Relax.updateOne({ user_id: user_id, track_id: track_id }, {is_favorite: false}, (err) => {
        if (err) {
            res.json(400).json({ status: 400, message: err });
        }
        else {
            res.status(202).json({ status: 202, message: "Removed Successfully" });
        }
    })
    console.log(rmvFav);
}

exports.allRelaxMelodySounds=async (req, res)=>{
    RelaxMelody.find({}, async (err, docs)=>{
        if(err){
            return res.status(400).json({status: 400, error: err});
        }
        console.log(docs);
        var result=[];
        var Nature=[];
        var Musical=[];
        var Other=[];
        docs.forEach(async (element)=>{
            if(element.sound_category == 'nature'){
                await Nature.push({
                    title: element.sound_title,
                    track_id: element._id,
                    track_url: process.env.DOMAIN + `/static/tracks/relaxMelodySounds/${element._id}.${element.track_extention}`
                })
            }
            if(element.sound_category == 'musical'){
                await Musical.push({
                    title: element.sound_title,
                    track_id: element._id,
                    track_url: process.env.DOMAIN + `/static/tracks/relaxMelodySounds/${element._id}.${element.track_extention}`
                })
            }
            if(element.sound_category == 'other'){
                await Other.push({
                    title: element.sound_title,
                    track_id: element._id,
                    track_url: process.env.DOMAIN + `/static/tracks/relaxMelodySounds/${element._id}.${element.track_extention}`
                })
            }
        })
        await result.push({
            Nature: Nature,
            Musical: Musical,
            Other: Other
        })
        return res.status(200).json({status:200, response: result});
    })
}
