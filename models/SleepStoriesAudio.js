const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const SleepStoriesAudioSchema=new Schema({
    story_id: {
        type: ObjectId,
    },
    audio_title: {
        type: String
    },
    audio_language: {
        type: String
    },
    track_extention: {
        type: String
    }
});

const SleepStoryAudio = mongoose.model("SleepStoryAudio", SleepStoriesAudioSchema);
module.exports = SleepStoryAudio;