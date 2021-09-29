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
adminRoute.get('/logout', adminController.logout);

//GET /admin/users --admin login page (web)
adminRoute.get('/users', adminController.usersPage);

//GET /admin/tracks --admin login page (web)
adminRoute.get('/tracks', adminController.tracksPage);

//GET /admin/tracks --admin login page (web)
adminRoute.get('/sleepStories', adminController.sleepStories);

//GET /admin/tracks --admin login page (web)
adminRoute.get('/relaxMelodies', adminController.relaxMelodies);

//GET /admin/tracks --admin login page (web)
adminRoute.get('/liveMeditation', adminController.liveMeditation);

//GET /admin/tracks --admin login page (web)
adminRoute.get('/notification', adminController.notificationPage);


adminRoute.get('/getSectionCategories/:section', adminController.protect, adminController.getSectionCategories)
// Admin Specific
adminRoute.get("/getAllUsers", adminController.protect, adminController.getAllUsers);
adminRoute.get("/getAllTracks", adminController.protect, adminController.getAllTracks);
adminRoute.get("/getSleepStories", adminController.protect, adminController.getSleepStories);
adminRoute.get("/getRelaxMelodySounds", adminController.protect, adminController.getRelaxMelodySounds);
adminRoute.get("/getLiveTracks", adminController.protect, adminController.getLiveTracks);
adminRoute.get("/getNotifications", adminController.protect, adminController.getNotifications);

// tracks functionalities
adminRoute.post('/uploadTrack', adminController.protect, adminController.uploadTrack)
adminRoute.post('/uploadSleepStory', adminController.protect, adminController.uploadSleepStory)
adminRoute.post('/uploadRelaxMelodySound', adminController.protect, adminController.uploadRelaxMelodySound)
adminRoute.post('/uploadLiveTrack', adminController.protect, adminController.uploadLiveTrack)
adminRoute.post('/uploadNotification', adminController.protect, adminController.uploadNotification)

adminRoute.delete('/trackDelete/:id', adminController.protect, adminController.trackDelete);
adminRoute.delete('/sleepStoryDelete/:id', adminController.protect, adminController.sleepStoryDelete)
adminRoute.delete('/relaxMelodySoundDelete/:id', adminController.protect, adminController.relaxMelodySoundDelete)
adminRoute.delete('/liveTrackDelete/:id', adminController.protect, adminController.liveTrackDelete)
adminRoute.delete('/notificationDelete/:id', adminController.protect, adminController.notificationDelete)

//through postman
adminRoute.post('/addAppSection', adminController.addAppSection)
adminRoute.post('/addMusicCategory', adminController.addMusicCategory)

  
module.exports=adminRoute;