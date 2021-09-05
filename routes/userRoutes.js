const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

// all Routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

//add email verification api here-- pending and their functions in authController.js file
router.post("/verifyEmail", authController.varifyEmail);

//add google and facebook login api's here and their functions in authController.js file


router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword", authController.resetPassword);

router.post("/updateMyPassword", authController.protect, authController.updatePassword);

router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

router.post('/addUserMood', authController.protect, userController.addUserMood);

module.exports = router;
