const SleepTrack=require('../models/SleepTracksModel');

const fs = require('fs');
const path = require('path');
var staticFilesPath = path.join(__dirname, '../static');

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
        return res.status(200).json(result);
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

exports.download = (req, res) => {
    console.log("got downloading request")

    const trackID= req.params.trackID;

    // range headers are requested from frontend
    const range = req.headers.range;
    if (!range) {
        return res.status(400).json({ status: "400", message: "Require range header" });
    }
    try{
        const audioPath=staticFilesPath + `/tracks/sleepTracks/${trackID}.mp3`;
        const audioSize=fs.statSync(audioPath).size;
    
        const CHUNK_SIZE = (10**6)/4; //256kb
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, audioSize-1);
    
        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${audioSize}`,
            "Accept-Range": `bytes`,
            "Content-Length": contentLength,
            "Content-Type": "audio/mp3"
        };
    
        res.writeHead(206, headers);
    
        const audioStream=fs.createReadStream(audioPath, { start, end });
    
        audioStream.pipe(res).once("error", ()=>{
            return res.status(400).json({error:"something went wrong"});
        })
    }catch(error){
        const audioPath=staticFilesPath + `/tracks/sleepTracks/${trackID}.wav`;
        const audioSize=fs.statSync(audioPath).size;
    
        const CHUNK_SIZE = (10**6)/4; //256kb
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, audioSize-1);
    
        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${audioSize}`,
            "Accept-Range": `bytes`,
            "Content-Length": contentLength,
            "Content-Type": "audio/mp3"
        };
    
        res.writeHead(206, headers);
    
        const audioStream=fs.createReadStream(audioPath, { start, end });
    
        audioStream.pipe(res).once("error", ()=>{
            return res.status(400).json({error:"something went wrong"});
        })

    }
};