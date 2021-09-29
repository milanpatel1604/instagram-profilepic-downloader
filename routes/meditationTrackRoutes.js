const express = require('express');
const meditationTrackRoute = express.Router();

const meditationController=require('../controllers/meditationController')
const authController = require("../controllers/authController");
const { title } = require('process');


//GET  /api/meditation/allMeditationTracks --fetching all tracks of meditation
meditationTrackRoute.get('/allMeditationTracks', authController.protect, meditationController.allMeditationTracks)

//GET  /api/meditation/categorizedMeditationTracks --fetching all tracks of meditation
meditationTrackRoute.get('/categorizedMeditationTracks', authController.protect, meditationController.categorizedMeditationTracks)

//GET  /api/meditation/getMeditationTrack/:track_id --fetching all tracks of meditation
meditationTrackRoute.get('/getMeditationTrack/:track_id', authController.protect, meditationController.getMeditationTrack)

//daily live meditation-- pending...
//GET  /api/meditation/allLiveTracks --fetching all tracks of meditation
meditationTrackRoute.get('/allLiveTracks', authController.protect, meditationController.allLiveTracks)
//GET  /api/meditation/getLiveTrack/:track_id --fetching all tracks of meditation
meditationTrackRoute.get('/getLiveTrack/:track_id', authController.protect, meditationController.getLiveTrack)

// userspecific--
meditationTrackRoute.post('/addMeditationFavorite', authController.protect, meditationController.addMeditationFavorite)
meditationTrackRoute.get('/getMeditationFavorite/:user_id', authController.protect, meditationController.getMeditationFavorite)
meditationTrackRoute.post('/removeMeditationFavorite', authController.protect, meditationController.removeMeditationFavorite)


module.exports = meditationTrackRoute;