const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const RelaxTracksSchema=new Schema({
    user_id: {
        type: ObjectId,
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


const Relax = mongoose.model("Relax", RelaxTracksSchema);
module.exports = Relax;