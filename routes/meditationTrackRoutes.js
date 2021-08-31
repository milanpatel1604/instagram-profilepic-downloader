const express = require('express');
const meditationTrackRoute = express.Router();

const meditationController=require('../controllers/meditationController')
const authController = require("../controllers/authController");
const { title } = require('process');


//GET  /api/meditation/allMeditationTracks --fetching all tracks of meditation
meditationTrackRoute.get('/allMeditationTracks', meditationController.allMeditationTracks)

//GET  /api/meditation/getMeditationTrack/:track_id --fetching all tracks of meditation
meditationTrackRoute.get('/getMeditationTrack/:track_id', meditationController.getMeditationTrack)

//daily live meditation-- pending...
//GET  /api/meditation/allLiveTracks --fetching all tracks of meditation
meditationTrackRoute.get('/allLiveTracks', meditationController.allLiveTracks)
//GET  /api/meditation/getLiveTrack/:track_id --fetching all tracks of meditation
meditationTrackRoute.get('/getLiveTrack/:track_id', meditationController.getLiveTrack)

// userspecific--
meditationTrackRoute.post('/addMeditationFavorite', meditationController.addMeditationFavorite)
meditationTrackRoute.get('/getMeditationFavorite/:user_id', meditationController.getMeditationFavorite)
meditationTrackRoute.post('/removeMeditationFavorite', meditationController.removeMeditationFavorite)


module.exports = meditationTrackRoute;