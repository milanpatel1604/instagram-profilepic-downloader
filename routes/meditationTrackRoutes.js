const express = require('express');
const meditationTrackRoute = express.Router()


const meditationController=require('../controllers/meditationController')
const { title } = require('process');



// testing purpose web page
meditationTrackRoute.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})


//GET  /api/meditation/allMeditationTracks --fetching all tracks of meditation
meditationTrackRoute.get('/allMeditationTracks', meditationController.allMeditationTracks)


// POST  /api/meditation/upload --uploading to db (Testing)-replace trackName with audio file name in local system.
meditationTrackRoute.post('/upload', meditationController.upload);


// GET  /api/meditation/download/trackID  --fetching perticular audio file by replacing trackName in url with audio filename
meditationTrackRoute.get('/download/:trackID',meditationController.download);


module.exports = meditationTrackRoute;