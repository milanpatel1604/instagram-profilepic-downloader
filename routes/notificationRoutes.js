const express = require('express');
const notificationRoute = express.Router();

const notificationController=require('../controllers/notificationController')
const { title } = require('process');


//GET  /api/notification/allNotifications --fetching all tracks of meditation
notificationRoute.get('/allNotifications', notificationController.allNotifications)


module.exports = notificationRoute;