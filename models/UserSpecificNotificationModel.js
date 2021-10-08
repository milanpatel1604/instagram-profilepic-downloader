const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const UserSpecificNotificationsSchema=new Schema({
    user_id: {
        type: ObjectId,
        required: [true, "Please provide user_id for user preference"],
    },
    notification_id: {
        type: [ObjectId]
    },
    message: {
        type: [String]
    },
    related_to:{
        type: [String]
    },
    shown: {
        type: [Boolean],
    },
    date: {
        type: [String]
    },
});


const UserNotification = mongoose.model("UserNotification", UserSpecificNotificationsSchema);
module.exports = UserNotification;