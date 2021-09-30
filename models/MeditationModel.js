const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const MeditationTracksSchema=new Schema({
    user_id: {
        type: ObjectId,
        required: [true, "Please provide user_id"],
    },
    track_id:{
        type: ObjectId
    },
    live_id:{
        type: ObjectId
    },
    is_favorite: {
        type: Boolean,
        default: false
    },
});


const MeditationTrack = mongoose.model("MeditationTrack", MeditationTracksSchema);
module.exports = MeditationTrack;