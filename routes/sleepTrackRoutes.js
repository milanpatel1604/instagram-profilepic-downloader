const express = require('express');
const sleepTrackRoute = express.Router()

const fs = require('fs');
const path = require('path');
var staticFilesPath = path.join(__dirname, '../static');

const mongodb = require('mongodb');
const { title } = require('process');
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';


// connecting to database url
var result = mongodb.MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, (error, dbs) => {
    if (error) {
        return console.log(`database connection Error: ${error}`);
    }
    console.log("connected to the database server");
    result = dbs;
})


// testing purpose web page
sleepTrackRoute.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})


//GET  /api/sleep/allSleepTracks --fetching all tracks of sleep
sleepTrackRoute.get('/allSleepTracks', (req, res)=>{
    
    const trackDB = result.db('breathing-app-sleepDB')
    console.log("connected to the track Database ");
    trackDB.collection('fs.files').find({}).toArray(function(err, docs){
        if(err){
            return res.json({status: "error", error:`${err}`});
        }
        var tracks=[];
        for(let i=0;i<docs.length; i++){
            tracks.push(docs[i].filename);
        }
        return res.status(200).json(tracks);
    })
})



// GET  /api/sleep/upload/trackName --uploading to db (Testing)-replace trackName with audio file name in local system.
sleepTrackRoute.get('/upload/:trackName', (req, res) => {
    const title=req.params.trackName;

    // connecting to particular database in url
    const trackDB = result.db('breathing-app-sleepDB')
    console.log("connected to the track Database ");
    const bucket = new mongodb.GridFSBucket(trackDB);
    const videoUploadStream = bucket.openUploadStream(title);
    const videoReadStream = fs.createReadStream(staticFilesPath + `/${title}.mp3`);
    videoReadStream.pipe(videoUploadStream).once("finish",()=>{
        return res.status(201).json("track uploaded successfully")
    }).once("error", ()=>{
        return res.status(400).json({error:"something went wrong"});
    });
});


// GET  /api/sleep/download/trackName  --fetching perticular audio file from db by replacing trackName in url with filename in database
sleepTrackRoute.get('/download/:trackName', (req, res) => {
    console.log("got downloading request")

    const trackName= req.params.trackName;

    // range headers are requested from frontend
    const range = req.headers.range;
    if (!range) {
        return res.json({ status: "400", message: "Require range header" });
    }

    // connecting to particular database in url
    const trackDB = result.db('breathing-app-sleepDB')
    console.log("connected to the track Database ");
    trackDB.collection('fs.files').findOne({ filename: `${trackName}` }, (err, audio) => {
        if (!audio) {
            return res.status(404).json({ status: '404', error: 'Track is not available' })
        }else if(err){
            return res.json({status: "error", error:`${err}`});
        }
        const trackSize = audio.length;
        const start = Number(range.replace(/\D/g, ""))
        const end = trackSize - 1;

        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${trackSize}`,
            "Accept-Range": `bytes`,
            "Content-Length": contentLength,
            "Content-Type": "audio/mp3"
        };

        res.writeHead(206, headers);
 
        const bucket = new mongodb.GridFSBucket(trackDB);
        const downloadStream = bucket.openDownloadStreamByName(`${trackName}`, {
            start
        });

        downloadStream.pipe(res).once("error", ()=>{
            return res.status(400).json({error:"something went wrong"});
        });
    })
});


module.exports = sleepTrackRoute;