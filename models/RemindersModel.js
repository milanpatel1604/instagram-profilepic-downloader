const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const RemindersSchema=new Schema({
    user_id: {
        type: String,
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
    },
    reminder_timestamp: {
        type: Date
    }
});


const Reminders = mongoose.model("Reminders", RemindersSchema);
module.exports = Reminders;