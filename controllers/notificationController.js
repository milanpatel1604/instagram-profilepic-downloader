const Notification=require('../models/NotificationsModel');

const fs = require('fs');
const path = require('path');
var staticFilesPath = path.join(__dirname, '../static');

const dotenv = require("dotenv").config();


exports.allNotifications=async (req, res)=>{
    
    Notification.find({}, async (err, docs)=>{
        if(err){
            return res.status(400).json({status: 400, error: err});
        }
        res.status(200).json(docs);
    })
}