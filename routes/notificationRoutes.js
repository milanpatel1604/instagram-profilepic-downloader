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
notificationRoute.delete('/deleteOlderNotifications', authController.protect, notificationController.deleteOlderNotifications)

//GET  /api/notification/allNotifications --fetching all tracks of meditation
notificationRoute.delete('/deleteNotification/:notification_id', authController.protect, notificationController.deleteNotification)

module.exports = notificationRoute;