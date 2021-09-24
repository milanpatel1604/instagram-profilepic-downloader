const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const AppSectionsSchema=new Schema({
    section_name: {
        type: String,
        unique: [true, "Section already exist"],
    },
    section_description: {
        type: String
    }
});

const AppSection = mongoose.model("AppSection", AppSectionsSchema);
module.exports = AppSection;