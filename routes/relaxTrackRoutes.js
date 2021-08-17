const express = require('express');
const relaxTrackRoute = express.Router()

const relaxController=require('../controllers/relaxController')
const { title } = require('process');


//GET  /api/relax/allRelaxTracks --fetching all tracks of relax
relaxTrackRoute.get('/allRelaxTracks', relaxController.allRelaxTracks);
//GET  /api/relax/allRelaxMelodySounds --fetching all sounds of relax
relaxTrackRoute.get('/allRelaxMelodySounds', relaxController.allRelaxMelodySounds);

//GET  /api/meditation/getRelaxTrack --fetching all tracks of meditation
relaxTrackRoute.get('/getRelaxTrack/:track_id', relaxController.getRelaxTrack)

// GET  /api/relax/download/trackName  --fetching perticular audio file by replacing trackName in url with filename
relaxTrackRoute.get('/download/:trackID',relaxController.download);


module.exports = relaxTrackRoute;