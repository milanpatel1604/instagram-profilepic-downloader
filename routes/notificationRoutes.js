const express = require('express');
const notificationRoute = express.Router();

const notificationController=require('../controllers/notificationController')
const authController = require("../controllers/authController");
const { title } = require('process');


//GET  /api/notification/allNotifications --fetching all tracks of meditation
notificationRoute.get('/notificationsToShow', authController.protect, notificationController.notificationsToShow)

//GET  /api/notification/allNotifications --fetching all tracks of meditation
notificationRoute.get('/allNotifications', authController.protect, notificationController.allNotifications)

//GET  /api/notification/allNotifications --fetching all tracks of meditation
notificationRoute.get('/deleteNotifications', authController.protect, notificationController.deleteNotifications)

module.exports = notificationRoute;