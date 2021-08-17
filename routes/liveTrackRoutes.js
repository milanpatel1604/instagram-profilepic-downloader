const express = require('express');
const liveTrackRoute = express.Router();

const liveController=require('../controllers/liveController')
const { title } = require('process');


//GET  /api/live/allMeditationTracks --fetching all tracks of meditation
liveTrackRoute.get('/allLiveTracks', liveController.allLiveTracks)

//GET  /api/meditation/getLiveTrack/:track_id --fetching all tracks of meditation
liveTrackRoute.get('/getLiveTrack/:track_id', liveController.getLiveTrack)

// GET  /api/live/download/trackID  --fetching perticular audio file by replacing trackName in url with audio filename
liveTrackRoute.get('/download/:trackID',liveController.download);


module.exports = liveTrackRoute;