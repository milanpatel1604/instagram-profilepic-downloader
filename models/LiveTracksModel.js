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
        type: Date
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    }
});


const LiveTrack = mongoose.model("LiveTrack", LiveTracksSchema);
module.exports = LiveTrack;