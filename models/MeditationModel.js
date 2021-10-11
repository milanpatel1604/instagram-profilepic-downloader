const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const MeditationTracksSchema=new Schema({
    user_id: {
        type: ObjectId,
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


const Meditation = mongoose.model("Meditation", MeditationTracksSchema);
module.exports = Meditation;