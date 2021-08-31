const SleepTrack=require('../models/SleepTracksModel');
const User=require('../models/userModel');


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
        docs.forEach(async (element)=>{
            if(element.category_id.includes(process.env.SleepMusicId)){
                await music.push({
                    title: element.title,
                    artist: element.artist,
                    image_url: process.env.DOMAIN + `/static/tracks/sleepImages/${element._id}.${element.image_extention}`,
                    track_id: element._id,
                    isPremium: element.isPremium
                })
            }
            if(element.category_id.includes(process.env.SleepStoriesId)){
                await stories.push({
                    title: element.title,
                    artist: element.artist,
                    image_url: process.env.DOMAIN + `/static/tracks/sleepImages/${element._id}.${element.image_extention}`,
                    track_id: element._id,
                    isPremium: element.isPremium
                })
            }
            if(element.category_id.includes(process.env.SleepMysteriousId)){
                await mysterious.push({
                    title: element.title,
                    artist: element.artist,
                    image_url: process.env.DOMAIN + `/static/tracks/sleepImages/${element._id}.${element.image_extention}`,
                    track_id: element._id,
                    isPremium: element.isPremium
                })
            }
        })
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