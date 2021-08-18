const express = require('express');
const relaxTrackRoute = express.Router()

const relaxController=require('../controllers/relaxController')
const authController = require("../controllers/authController");
const { title } = require('process');


//GET  /api/relax/allRelaxTracks --fetching all tracks of relax
relaxTrackRoute.get('/allRelaxTracks', relaxController.allRelaxTracks);

//GET  /api/meditation/getRelaxTrack --fetching all tracks of meditation
relaxTrackRoute.get('/getRelaxTrack/:track_id', relaxController.getRelaxTrack)

//Relax Melody--
//GET  /api/relax/allRelaxMelodySounds --fetching all sounds of relax
relaxTrackRoute.get('/allRelaxMelodySounds', relaxController.allRelaxMelodySounds);


// userspecific--
relaxTrackRoute.post('/addRelaxFavorite', authController.protect, relaxController.addRelaxFavorite);

module.exports = relaxTrackRoute;