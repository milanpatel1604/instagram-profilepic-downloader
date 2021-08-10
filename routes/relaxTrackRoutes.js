const express = require('express');
const relaxTrackRoute = express.Router()

const relaxController=require('../controllers/relaxController')

const { title } = require('process');



// testing purpose web page
relaxTrackRoute.get('/', (req, res) => {
    res.sendFile(__dirname + "/audio.html")
})


//GET  /api/relax/allRelaxTracks --fetching all tracks of relax
relaxTrackRoute.get('/allRelaxTracks', relaxController.allRelaxTracks);



// GET  /api/relax/upload --uploading to db (Testing)-replace trackName with audio file name in local system.
relaxTrackRoute.post('/upload', relaxController.upload);


// GET  /api/relax/download/trackName  --fetching perticular audio file by replacing trackName in url with filename
relaxTrackRoute.get('/download/:trackID',relaxController.download);


module.exports = relaxTrackRoute;