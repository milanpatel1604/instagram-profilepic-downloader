const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const LiveTracksSchema=new Schema({
    section_id: {
        type: ObjectId
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
    date: {
        type: String
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    track_duration: {
        type: String,
        default: "00:30:00"
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