const express=require('express');
const adminRoute = express.Router();

const adminController=require('../controllers/adminController');

adminRoute.use(express.json());


//GET /admin --admin login page (web)
adminRoute.get('/', adminController.homePage);

//GET /admin/authenticate --admin login page (web)
adminRoute.get('/login', adminController.loginPage);
//POST /admin/authenticate --admin home page (web)
adminRoute.post('/authenticate', adminController.loginVerification);
//GET /admin/authenticate --admin home page (web)
adminRoute.get('/check',adminController.protect, adminController.check);
//GET /admin/authenticate --admin home page (web)
adminRoute.get('/logout',adminController.protect, adminController.logout);

//GET /admin/users --admin login page (web)
adminRoute.get('/users', adminController.usersPage);

//GET /admin/tracks --admin login page (web)
adminRoute.get('/meditationTracks', adminController.meditationTracksPage);

//GET /admin/tracks --admin login page (web)
adminRoute.get('/sleepTracks', adminController.sleepTracksPage);

//GET /admin/tracks --admin login page (web)
adminRoute.get('/relaxTracks', adminController.relaxTracksPage);

//GET /admin/tracks --admin login page (web)
adminRoute.get('/liveTracks', adminController.liveTracksPage);

//GET /admin/tracks --admin login page (web)
adminRoute.get('/notification', adminController.notificationPage);


// Admin Specific
adminRoute.get("/getAllUsers", adminController.protect, adminController.getAllUsers);
adminRoute.get("/getMeditationTracks", adminController.protect, adminController.getMeditationTracks);
adminRoute.get("/getSleepTracks", adminController.protect, adminController.getSleepTracks);
adminRoute.get("/getSleepStories", adminController.protect, adminController.getSleepStories);
adminRoute.get("/getRelaxTracks", adminController.protect, adminController.getRelaxTracks);
adminRoute.get("/getRelaxMelodySounds", adminController.protect, adminController.getRelaxMelodySounds);
adminRoute.get("/getLiveTracks", adminController.protect, adminController.getLiveTracks);
adminRoute.get("/getNotifications", adminController.protect, adminController.getNotifications);

// tracks functionalities
adminRoute.post('/uploadMeditationTrack', adminController.protect, adminController.uploadMeditationTrack)
adminRoute.post('/uploadSleepTrack', adminController.protect, adminController.uploadSleepTrack)
adminRoute.post('/uploadSleepStory', adminController.protect, adminController.uploadSleepStory)
adminRoute.post('/uploadRelaxTrack', adminController.protect, adminController.uploadRelaxTrack)
adminRoute.post('/uploadRelaxMelodySound', adminController.protect, adminController.uploadRelaxMelodySound)
adminRoute.post('/uploadLiveTrack', adminController.protect, adminController.uploadLiveTrack)
adminRoute.post('/uploadNotification', adminController.protect, adminController.uploadNotification)

adminRoute.delete('/meditationTrackDelete/:id', adminController.protect, adminController.meditationTrackDelete)
adminRoute.delete('/sleepTrackDelete/:id', adminController.protect, adminController.sleepTrackDelete)
adminRoute.delete('/sleepStoryDelete/:id', adminController.protect, adminController.sleepStoryDelete)
adminRoute.delete('/relaxTrackDelete/:id', adminController.protect, adminController.relaxTrackDelete)
adminRoute.delete('/relaxMelodySoundDelete/:id', adminController.protect, adminController.relaxMelodySoundDelete)
adminRoute.delete('/liveTrackDelete/:id', adminController.protect, adminController.liveTrackDelete)
adminRoute.delete('/notificationDelete/:id', adminController.protect, adminController.notificationDelete)

//through postman
adminRoute.post('/addAppSection', adminController.addAppSection)
adminRoute.post('/addMusicCategory', adminController.addMusicCategory)

  
module.exports=adminRoute;