const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const SleepTracksSchema=new Schema({
    title: {
        type: String,
    },
    artist: {
        type: String
    },
    category: {
        type: Array,
        // categories: ["Stories", "Music", "Mysterious"],
        default: "Music"
    },
    description: {
        type: String
    },
    isPremium: {
        type: Boolean
    }
    
});


const SleepTrack = mongoose.model("SleepTrack", SleepTracksSchema);
module.exports = SleepTrack;