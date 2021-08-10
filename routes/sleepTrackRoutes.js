const express = require('express');
const sleepTrackRoute = express.Router()

const sleepController=require('../controllers/sleepController')


const { title } = require('process');


// testing purpose web page
sleepTrackRoute.get('/', (req, res) => {
    res.sendFile(__dirname + "/audio.html")
})


//GET  /api/sleep/allSleepTracks --fetching all tracks of sleep
sleepTrackRoute.get('/allSleepTracks', sleepController.allSleepTracks);



// GET  /api/sleep/upload --uploading to db (Testing)-replace trackName with audio file name in local system.
sleepTrackRoute.post('/upload', sleepController.upload);


// GET  /api/sleep/download/trackName  --fetching perticular audio file by replacing trackName in url with filename
sleepTrackRoute.get('/download/:trackID',sleepController.download);


module.exports = sleepTrackRoute;