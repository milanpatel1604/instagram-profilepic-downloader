const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const SleepStoriesSchema=new Schema({
    section_id: {
        type: ObjectId
    },
    category_id: {
        type: [ObjectId],
    },
    title: {
        type: String,
    },
    artist: {
        type: String
    },
    description: {
        type: String
    },
    isPremium: {
        type: Boolean
    },
    track_duration: {
        type: String
    },
    image_extention: {
        type: String
    },
    track_extention: {
        type: String
    },
    language: {
        type: String
    },
    lessons: {
        type: String
    }
    
});

const SleepStory = mongoose.model("SleepStory", SleepStoriesSchema);
module.exports = SleepStory;