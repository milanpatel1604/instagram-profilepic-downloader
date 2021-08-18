const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

// all Routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

//add email verification api here-- pending and their functions in authController.js file


//add google and facebook login api's here and their functions in authController.js file


router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch("/updateMyPassword", authController.protect, authController.updatePassword);

router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);


module.exports = router;
