const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const LiveTracksSchema=new Schema({
    title: {
        type: String
    },
    artist: {
        type: String
    },
    description: {
        type: String
    },
    date: {
        type: String
    },
    time_slot: {
        type: String
    },
    image_extention: {
        type: String
    },
    track_extention: {
        type: String
    }
});


const LiveTrack = mongoose.model("LiveTrack", LiveTracksSchema);
module.exports = LiveTrack;