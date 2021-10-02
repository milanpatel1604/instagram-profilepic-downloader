const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const UserSubscriptionSchema=new Schema({
    subscription_id: {
        type: String
    },
    user_id: {
        type: String
    },
    premium_user: {
        type: Boolean,
        default: false
    },
    subscription_type: {
        type: String
    },
    subscription_validity: {
        type: String
    },
    start_date: {
        type: String
    },
    start_date_timestamp: {
        type: Date
    },
    end_date: {
        type: String
    },
    end_date_timestamp: {
        type: Date
    },
    free_premium: {
        type: Boolean
    },
    free_premium_available: {
        type: Boolean
    },
    promotional_code_applied: {
        type: String
    }
});

const UserSubscription = mongoose.model("UserSubscription", UserSubscriptionSchema);
module.exports = UserSubscription;