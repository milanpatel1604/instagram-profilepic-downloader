const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const RelaxMelodiesSchema=new Schema({
    sound_title: {
        type: String
    },
    sound_category: {
        type: String
    },
    track_extention: {
        type: String
    }
});

const RelaxMelody = mongoose.model("RelaxMelody", RelaxMelodiesSchema);
module.exports = RelaxMelody;