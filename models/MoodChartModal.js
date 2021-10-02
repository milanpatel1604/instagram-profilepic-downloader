const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId= Schema.ObjectId;

const MoodChartSchema=new Schema({
    user_id: {
        type: ObjectId
    },
    date: {
        type: String
    },
    timestamp: {
        type: Date
    },
    mood: {
        type: String,
        enum: ['amazing', 'happy', 'confused', 'okay', 'sad']
    }
});


const MoodChart = mongoose.model("MoodChart", MoodChartSchema);
module.exports = MoodChart;