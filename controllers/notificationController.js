const Notification=require('../models/NotificationsModel');

const fs = require('fs');
const path = require('path');
var staticFilesPath = path.join(__dirname, '../static');

const dotenv = require("dotenv").config();


exports.notificationsToShow=async (req, res)=>{
    
    await Notification.find({shown: false}, async (err, docs)=>{
        if(err){
            return res.status(400).json({status: 400, error: err});
        }
        res.status(200).json(docs);
    })
    Notification.updateMany({},{shown: true}, async (err, docs)=>{
        if(err){
            return res.status(400).json({status: 400, error: err});
        }
    })
}

exports.allNotifications=async (req, res)=>{
    
    Notification.find({}, async (err, docs)=>{
        if(err){
            return res.status(400).json({status: 400, error: err});
        }
        let date_ob=new Date();
        const presentDate= ("0"+date_ob.getDate()).slice(-2);
        const yesterdayDate= ("0"+(date_ob.getDate()-1)).slice(-2);
        const presentMonth= ("0"+(date_ob.getMonth()+1)).slice(-2);
        const presentYear=date_ob.getFullYear();
        const fullPresentDate= presentDate+"/"+presentMonth+"/"+presentYear;
        const fullYesterdayDate= yesterdayDate+"/"+presentMonth+"/"+presentYear;
        var results=[]
        await Promise.all(docs.map(async (element) => {
            console.log(element.date, fullPresentDate, fullYesterdayDate);
            if(element.date == fullPresentDate || element.date == fullYesterdayDate){
                console.log("pushing")
                results.push(element);
            }
        }))
        res.status(200).json({status:200, results: results});
    })
}

exports.deleteNotifications=async (req, res)=>{
    
    // Notification.find({}, async (err, docs)=>{
    //     if(err){
    //         return res.status(400).json({status: 400, error: err});
    //     }
    //     let date_ob=new Date();
    //     const presentDate= ("0"+date_ob.getDate()).slice(-2);
    //     const yesterdayDate= ("0"+(date_ob.getDate()-1)).slice(-2);
    //     const presentMonth= ("0"+(date_ob.getMonth()+1)).slice(-2);
    //     const presentYear=date_ob.getFullYear();
    //     const fullPresentDate= presentDate+"/"+presentMonth+"/"+presentYear;
    //     const fullYesterdayDate= yesterdayDate+"/"+presentMonth+"/"+presentYear;
    //     var results=[]
    //     await Promise.all(docs.map(async (element) => {
    //         console.log(element.date, fullPresentDate, fullYesterdayDate);
    //         if(element.date == fullPresentDate || element.date == fullYesterdayDate){
    //             console.log("pushing")
    //             results.push(element);
    //         }
    //     }))
    //     res.status(200).json({status:200, results: results});
    // })
    res.json("this route is pending...")
}