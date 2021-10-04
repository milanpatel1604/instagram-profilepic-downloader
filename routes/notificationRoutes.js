const express = require('express');
const notificationRoute = express.Router();

const notificationController=require('../controllers/notificationController')
const authController = require("../controllers/authController");
const { title } = require('process');


//GET  /api/notification/allNotifications --fetching all tracks of meditation
notificationRoute.get('/notificationsToShow', notificationController.notificationsToShow)

//GET  /api/notification/allNotifications --fetching all tracks of meditation
notificationRoute.get('/allNotifications', notificationController.allNotifications)

//GET  /api/notification/allNotifications --fetching all tracks of meditation
notificationRoute.delete('/deleteNotifications', notificationController.deleteNotifications)

module.exports = notificationRoute;