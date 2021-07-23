const SleepTrack=require('../models/SleepTracksModel');
const fs = require('fs');
const path = require('path');
var staticFilesPath = path.join(__dirname, '../static');

exports.allSleepTracks=(req, res)=>{
    
    SleepTrack.find({}, async (err, docs)=>{
        if(err){
            return res.status(400).json({status: "error", error: err});
        }
        return res.status(200).json(docs);
    })
}


exports.upload=async (req, res) => {
    const { title, artist, description, isPremium}=req.body;

    const newSleepTrack = await SleepTrack.create({
        title: title,
        artist: artist, 
        description: description,
        isPremium: isPremium
    })
    return res.json(newSleepTrack);

};

exports.download = (req, res) => {
    console.log("got downloading request")

    const trackID= req.params.trackID;

    SleepTrack.findById(trackID, (err, docs)=>{
        if(!docs){
            return res.status(404).json({message: "Track not found"})
        }else if(err){
            return res.status(400).json({message: "some thing went wrong"});
        }

        // range headers are requested from frontend
        const range = req.headers.range;
        if (!range) {
            return res.status(400).json({ status: "400", message: "Require range header" });
        }
    
        const audioPath=staticFilesPath + `/sleepTracks/${docs.title}.mp3`;
        const audioSize=fs.statSync(audioPath).size;
    
        const CHUNK_SIZE = (10**6)/2; //512kb
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
        
    })
};