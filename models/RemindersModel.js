const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const RemindersSchema=new Schema({
    user_id: {
        type: ObjectId,
        unique: [true, "user_id already exist in User_Preferences"],
        required: [true, "Please provide user_id for user preference"],
    },
    reminder_date: {
        type: String,
    },
    reminder_title: {
        type: String,
    },
    reminder_time: {
        type: String,
    },
    is_active: {
        type: Boolean,
        default: true
    }
});


const Reminders = mongoose.model("Reminders", RemindersSchema);
module.exports = Reminders;