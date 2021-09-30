const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const SleepTracksSchema=new Schema({
    user_id: {
        type: ObjectId,
        required: [true, "Please provide user_id"],
    },
    track_id:{
        type: ObjectId
    },
    audio_id:{
        type: ObjectId
    },
    is_favorite: {
        type: Boolean,
        default: false
    },
});


const SleepTrack = mongoose.model("SleepTrack", SleepTracksSchema);
module.exports = SleepTrack;