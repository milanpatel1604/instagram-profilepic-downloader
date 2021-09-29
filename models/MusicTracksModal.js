const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const MusicTracksSchema=new Schema({
    section_id: {
        type: ObjectId
    },
    category_id: {
        type: [ObjectId],
    },
    title: {
        type: String
    },
    artist: {
        type: String
    },
    description: {
        type: String
    },
    isPremium: {
        type: Boolean,
        default: false
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


const MusicTrack = mongoose.model("MusicTrack", MusicTracksSchema);
module.exports = MusicTrack;