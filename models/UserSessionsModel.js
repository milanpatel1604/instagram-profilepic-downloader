const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const UserSessionsSchema=new Schema({
    user_id: {
        type: ObjectId,
    },
    date_joined: {
        type: String,
    },
    last_login: {
        type: String,
    },
    total_breathe_sessions: {
        type: Number,
        default: 0
    },
    total_sleep_sessions: {
        type: Number,
        default: 0
    },
    total_relax_sessions: {
        type: Number,
        default: 0
    },
    total_meditation_sessions: {
        type: Number,
        default: 0
    },
    total_relax_music_played: {
        type: Number,
        default: 0
    },
    is_active: {
        type: Boolean,
        default: true,
    }
});


const UserSession = mongoose.model("UserSession", UserSessionsSchema);
module.exports = UserSession;