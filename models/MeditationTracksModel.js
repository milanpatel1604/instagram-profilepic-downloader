const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const MeditationTracksSchema=new Schema({
    title: {
        type: String,
        unique: true
    },
    artist: {
        type: String
    },
    description: {
        type: String
    },
    isPremium: {
        type: Boolean
    }
    
});


const MeditationTrack = mongoose.model("MeditationTrack", MeditationTracksSchema);
module.exports = MeditationTrack;