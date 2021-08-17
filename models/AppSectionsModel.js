const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const AppSectionsSchema=new Schema({
    section_name: {
        type: String
    },
    section_description: {
        type: String
    }
});

const AppSection = mongoose.model("AppSection", AppSectionsSchema);
module.exports = AppSection;