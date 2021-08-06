const path=require('path');
const express=require('express');
const adminRoute = express.Router();

const adminController=require('../controllers/adminController');

var viewsFilePath= path.join(__dirname, '../views');

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
adminRoute.get("/getRelaxTracks", adminController.protect, adminController.getRelaxTracks);
adminRoute.get("/getLiveTracks", adminController.protect, adminController.getLiveTracks);
adminRoute.get("/getNotifications", adminController.protect, adminController.getNotifications);

// tracks functionalities
adminRoute.put('/uploadMeditationTrack', adminController.protect, adminController.uploadMeditationTrack)


// adminRoute
//   .route("/users/:id")
//   .get(adminController.getUser)
//   .patch(adminController.updateUser)
//   .delete(adminController.deleteUser);

  
module.exports=adminRoute;