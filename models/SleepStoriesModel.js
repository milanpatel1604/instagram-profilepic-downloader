const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const SleepStoriesSchema=new Schema({
    language: {
        type: [ObjectId]
    },
    track_extention: {
        type: String
    }
});

const SleepStory = mongoose.model("SleepStory", SleepStoriesSchema);
module.exports = SleepStory;