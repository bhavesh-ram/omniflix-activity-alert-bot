var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    userId: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    omniflixAddress: {
        type: String,
    },
    isSubscribe: {
        type: Boolean,
        default: false,
    },
    chatDate:{
        type:Date,   
    },
    collections: {
        type: [String],
        default: [],
    },
    channels: {
        type: [String],
        default: [],
    },
    notificationTypes: {
        type: [String],
        enum: [
            'Create Auction',
            'List NFT',
            'Bulk Listing',
            'Bulk Create Auction',
            'Create Campaign',
            'End Campaign',
            'Interactive Videos',
            'Channels'
        ],
        default: [], // Default to an empty array for notification types
      },
    
}, { timestamps: true });

var userData = mongoose.model('user', userSchema);
module.exports = {
    userData: userData,
};
