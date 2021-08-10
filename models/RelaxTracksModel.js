const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const RelaxTracksSchema=new Schema({
    title: {
        type: String,
    },
    artist: {
        type: String
    },
    category: {
        type: Array,
        // categories: ["Beginners", "Self-Calm"],
        default: "Beginners"
    },
    description: {
        type: String
    },
    isPremium: {
        type: Boolean
    }
    
});


const RelaxTrack = mongoose.model("RelaxTrack", RelaxTracksSchema);
module.exports = RelaxTrack;