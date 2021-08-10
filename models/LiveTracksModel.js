const mongoose=require('mongoose');
const Schema = mongoose.Schema;

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
    startTime: {
        type: String
    },
    endTime: {
        type: String
    }
});


const LiveTrack = mongoose.model("LiveTrack", LiveTracksSchema);
module.exports = LiveTrack;