const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const SleepTracksSchema=new Schema({
    section_id: {
        type: ObjectId
    },
    category_id: {
        type: [ObjectId],
    },
    title: {
        type: String,
    },
    artist: {
        type: String
    },
    description: {
        type: String
    },
    isPremium: {
        type: Boolean
    },
    track_duration: {
        type: String
    },
    image_extention: {
        type: String
    },
    track_extention: {
        type: String
    }
});


const SleepTrack = mongoose.model("SleepTrack", SleepTracksSchema);
module.exports = SleepTrack;