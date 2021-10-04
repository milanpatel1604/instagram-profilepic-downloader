const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const NotificationsSchema=new Schema({
    message: {
        type: String
    },
    related_to: {
        type: String
    },
    date: {
        type: String
    },
    shown: {
        type: Boolean
    }
});


const Notification = mongoose.model("Notification", NotificationsSchema);
module.exports = Notification;