const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const NotificationsSchema=new Schema({
    user_id: {
        type: ObjectId,
        required: [true, "Please provide user_id for user preference"],
    },
    message: {
        type: String
    },
    date: {
        type: String
    },
    shown: {
        type: Boolean
    },
    shown: {
        type: Boolean
    }
});


const Notification = mongoose.model("Notification", NotificationsSchema);
module.exports = Notification;