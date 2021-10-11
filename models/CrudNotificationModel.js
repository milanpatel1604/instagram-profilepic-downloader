const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const CrudNotiSchema=new Schema({
    user_id: {
        type: ObjectId,
        required: [true, "Please provide user_id for user preference"],
    },
    notifications: [{
        notification_id: ObjectId,
        message: String,
        related_to: String,
        shown: Boolean,
        date: String
    }],
});


const CrudNotify = mongoose.model("CrudNotify", CrudNotiSchema);
module.exports = CrudNotify;