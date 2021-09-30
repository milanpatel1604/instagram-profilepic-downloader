const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const RelaxTracksSchema=new Schema({
    user_id: {
        type: ObjectId,
        required: [true, "Please provide user_id"],
    },
    track_id:{
        type: ObjectId
    },
    sound_id:{
        type: ObjectId
    },
    is_favorite: {
        type: Boolean,
        default: false
    },
});


const RelaxTrack = mongoose.model("RelaxTrack", RelaxTracksSchema);
module.exports = RelaxTrack;