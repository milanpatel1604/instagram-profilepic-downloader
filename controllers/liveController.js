const LiveTrack=require('../models/LiveTracksModel');

const fs = require('fs');
const path = require('path');
var staticFilesPath = path.join(__dirname, '../static');


exports.allLiveTracks=(req, res)=>{
    
    LiveTrack.find({}, async (err, docs)=>{
        if(err){
            return res.status(400).json({status: 400, error: err});
        }
        console.log(docs);
        var result=[];
        docs.forEach(async (element)=>{
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
        return res.status(200).json(result);
    })
}

exports.getLiveTrack= async (req, res)=>{
    const track_id=req.params.track_id;
    LiveTrack.findOne({_id: track_id}, async (err, docs)=>{
        if(err){
            return res.status(400).json({status: 400, error: err});
        }
        return res.status(200).json({
            track_url: process.env.DOMAIN + `/static/tracks/liveTracks/${docs._id}.${docs.track_extention}`,
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
        const audioPath=staticFilesPath + `/tracks/liveTracks/${trackID}.mp3`;
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
        const audioPath=staticFilesPath + `/tracks/liveTracks/${trackID}.wav`;
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