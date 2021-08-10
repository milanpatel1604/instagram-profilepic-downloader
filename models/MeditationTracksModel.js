const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const MeditationTracksSchema=new Schema({
    title: {
        type: String
    },
    artist: {
        type: String
    },
    category: {
        type: Array,
        // categories: ["Beginners", "Stress"],
        default: "Beginners"
    },
    description: {
        type: String
    },
    isPremium: {
        type: Boolean,
        default: false
    }
    
});


const MeditationTrack = mongoose.model("MeditationTrack", MeditationTracksSchema);
module.exports = MeditationTrack;