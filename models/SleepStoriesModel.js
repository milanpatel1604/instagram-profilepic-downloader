const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const SleepStoriesSchema=new Schema({
    story_name: {
        type: String,
    },
    story_description: {
        type: String
    },
    lessons: {
        type: String
    },
    image_extention: {
        type: String
    }
});

const SleepStory = mongoose.model("SleepStory", SleepStoriesSchema);
module.exports = SleepStory;