const express = require('express');
const sleepTrackRoute = express.Router()

const sleepController=require('../controllers/sleepController')
const { title } = require('process');


//GET  /api/sleep/allSleepTracks --fetching all tracks of sleep
sleepTrackRoute.get('/allSleepTracks', sleepController.allSleepTracks);

//GET  /api/meditation//getSleepTrack/:track_id --fetching all tracks of meditation
sleepTrackRoute.get('/getSleepTrack/:track_id', sleepController.getSleepTrack)

// GET  /api/sleep/download/trackName  --fetching perticular audio file by replacing trackName in url with filename
sleepTrackRoute.get('/download/:trackID',sleepController.download);


module.exports = sleepTrackRoute;