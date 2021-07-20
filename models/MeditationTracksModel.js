const mongoose=require('mongoose');

const MeditationTracksSchema=mongoose.Schema({
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

module.exports=mongoose.model('MeditationTracksSchema', MeditationTracksSchema);