const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

// all Routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post('/resendVerifyEmailToken', authController.resendVerifyEmailToken)

//email verification api
router.post("/verifyEmail", authController.varifyEmail);

//add google and facebook login api's here and their functions in authController.js file
router.post('/loginWithGoogle', authController.loginWithGoogle)
// app.get('/loginWithFacebook', passport.authenticate('facebook',{scope:'email'}));
router.post('/loginWithFacebook', authController.loginWithFacebook)


//other routes
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword", authController.resetPassword);

//autologin or check
router.post("/checkLogin", authController.protect, authController.checkLogin);

router.post("/updateMyPassword", authController.protect, authController.updatePassword);

router.post("/updateMe", authController.protect, userController.updateMe);
router.post("/updateUserPreferences", authController.protect, userController.updateUserPreference);
router.get('/getUserPreferences', authController.protect, userController.getUserPreference)
router.delete("/deleteMe", authController.protect, userController.deleteMe);

router.post('/addUserMood', authController.protect, userController.addUserMood);

module.exports = router;
