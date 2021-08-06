const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const NotificationsSchema=new Schema({
    message: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    isPremium: {
        type: Boolean
    }
    
});


const Notification = mongoose.model("Notification", NotificationsSchema);
module.exports = Notification;