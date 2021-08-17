const express = require('express');
const meditationTrackRoute = express.Router();

const meditationController=require('../controllers/meditationController')
const { title } = require('process');


//GET  /api/meditation/allMeditationTracks --fetching all tracks of meditation
meditationTrackRoute.get('/allMeditationTracks', meditationController.allMeditationTracks)

//GET  /api/meditation/getMeditationTrack/:track_id --fetching all tracks of meditation
meditationTrackRoute.get('/getMeditationTrack/:track_id', meditationController.getMeditationTrack)

// GET  /api/meditation/download/trackID  --fetching perticular audio file by replacing trackName in url with audio filename
meditationTrackRoute.get('/download/:trackID',meditationController.download);


module.exports = meditationTrackRoute;