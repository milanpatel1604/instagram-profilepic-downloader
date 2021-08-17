const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const MusicCategoriesSchema=new Schema({
    section_id: {
        type: ObjectId
    },
    category_name: {
        type: String
    },
});

const MusicCategory = mongoose.model("MusicCategory", MusicCategoriesSchema);
module.exports = MusicCategory;