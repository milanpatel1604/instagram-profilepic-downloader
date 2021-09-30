const express = require('express');
const relaxTrackRoute = express.Router()

const relaxController=require('../controllers/relaxController')
const authController = require("../controllers/authController");
const { title } = require('process');


//GET  /api/relax/allRelaxTracks --fetching all tracks of relax
relaxTrackRoute.get('/allRelaxTracks', authController.protect, relaxController.allRelaxTracks);

//GET  /api/relax/categorizedRelaxTracks --fetching categorized tracks of relax
relaxTrackRoute.get('/categorizedRelaxTracks', authController.protect, relaxController.categorizedRelaxTracks)

//GET  /api/relax/getRelaxTrack --fetching all tracks of relax
relaxTrackRoute.get('/getRelaxTrack/:track_id', authController.protect, relaxController.getRelaxTrack)

//Relax Melody--
//GET  /api/relax/allRelaxMelodySounds --fetching all sounds of relax
relaxTrackRoute.get('/allRelaxMelodySounds', authController.protect, relaxController.allRelaxMelodySounds);


// userspecific--
relaxTrackRoute.get('/addRelaxFavorite/:track_id', authController.protect, relaxController.addRelaxFavorite);
relaxTrackRoute.get('/getRelaxFavorite', authController.protect, relaxController.getRelaxFavorite)
relaxTrackRoute.get('/removeRelaxFavorite/:track_id', authController.protect, relaxController.removeRelaxFavorite)

module.exports = relaxTrackRoute;