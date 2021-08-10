const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const NotificationsSchema=new Schema({
    message: {
        type: String
    },
    date: {
        type: String
    },
    isPremium: {
        type: Boolean
    }
    
});


const Notification = mongoose.model("Notification", NotificationsSchema);
module.exports = Notification;