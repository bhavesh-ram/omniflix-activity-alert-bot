var mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
    sender: {
        type: String,       
    },
    creator: {
        type: String,        
    },
    amount: {
        denom: {
            type: String,           
        },
        amount: {
            type: Number,            
        },
    },
    transacation_hash: {
        type: String,        
    },
    channel_username: {
        type: String,
    },
    interactive_video: {
        type: Object,
    },
    usd_value: {
        type: Number,
    },
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
    },
    isNotified: {
        type: Boolean,
        default: false,
    }
});

var tipData = mongoose.model('tip', tipSchema);

module.exports = {
    tipData,
};