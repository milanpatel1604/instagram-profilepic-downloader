const express = require('express');
const sleepTrackRoute = express.Router()

const sleepController=require('../controllers/sleepController');
const authController = require("../controllers/authController");
const { title } = require('process');


//GET  /api/sleep/allSleepTracks --fetching all tracks of sleep
sleepTrackRoute.get('/allSleepTracks', authController.protect, sleepController.allSleepTracks);

//GET  /api/meditation//getSleepTrack/:track_id --fetching all tracks of sleep
sleepTrackRoute.get('/getSleepTrack/:track_id', authController.protect, sleepController.getSleepTrack)

//GET  /api/meditation/categorizedSleepTracks --fetching all tracks of sleep
sleepTrackRoute.get('/categorizedSleepTracks', authController.protect, sleepController.categorizedSleepTracks)

// sleepStories-- pending...
//GET  /api/sleep/allSleepStories --fetching all tracks of sleep
sleepTrackRoute.get('/allSleepStories', authController.protect, sleepController.allSleepStories)
//GET  /api/meditation/getLiveTrack/:story_id --fetching all tracks of sleep
sleepTrackRoute.get('/getSleepStory/:story_id', authController.protect, sleepController.getSleepStory)
//GET  /api/meditation/getLiveTrack/:story_id --fetching all tracks of sleep
sleepTrackRoute.get('/allStoryLanguages/:story_id', authController.protect, sleepController.allStoryLanguages)

// favorite--
sleepTrackRoute.get('/addSleepFavorite/:track_id', authController.protect, sleepController.addSleepFavorite);
sleepTrackRoute.get('/getSleepFavorite', authController.protect, sleepController.getSleepFavorite)
sleepTrackRoute.get('/removeSleepFavorite/:track_id', authController.protect, sleepController.removeSleepFavorite)
// story favorite--
sleepTrackRoute.get('/addSleepStoryFavorite/:story_id', authController.protect, sleepController.addSleepStoryFavorite);
sleepTrackRoute.get('/removeSleepStoryFavorite/:story_id', authController.protect, sleepController.removeSleepStoryFavorite)

module.exports = sleepTrackRoute;