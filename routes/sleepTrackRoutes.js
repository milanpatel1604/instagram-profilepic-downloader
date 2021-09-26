const express = require('express');
const sleepTrackRoute = express.Router()

const sleepController=require('../controllers/sleepController');
const authController = require("../controllers/authController");
const { title } = require('process');


//GET  /api/sleep/allSleepTracks --fetching all tracks of sleep
sleepTrackRoute.get('/allSleepTracks', authController.protect, sleepController.allSleepTracks);

//GET  /api/meditation//getSleepTrack/:track_id --fetching all tracks of meditation
sleepTrackRoute.get('/getSleepTrack/:track_id', authController.protect, sleepController.getSleepTrack)

// sleepStories-- pending...
//GET  /api/sleep/allSleepStories --fetching all tracks of meditation
sleepTrackRoute.get('/allSleepStories', authController.protect, sleepController.allSleepStories)
//GET  /api/meditation/getLiveTrack/:track_id --fetching all tracks of meditation
sleepTrackRoute.get('/getSleepStories/:track_id', authController.protect, sleepController.getSleepStory)


// userspecific--
sleepTrackRoute.post('/addSleepFavorite', authController.protect, sleepController.addSleepFavorite);
sleepTrackRoute.get('/getSleepFavorite/:user_id', authController.protect, sleepController.getSleepFavorite)
sleepTrackRoute.post('/removeSleepFavorite', authController.protect, sleepController.removeSleepFavorite)

module.exports = sleepTrackRoute;