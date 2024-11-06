const mongoose = require('mongoose');
const { omniflixMarketplaceBot } = require('../../database');
const logger = require('../../logger');

const userSchema = mongoose.Schema({
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
            'New Auction Creation',
            'NFT Listings',
            'Multiple NFT Listings',
            'Multiple Auctions Creation',
            'Campaign Creation',
            'End Campaign',
            'New Interactive Content',
            'New Channels'
        ],
        default: [],
      },
    
}, { timestamps: true });


userSchema.index({ userId: 1 }, { unique: true });
userSchema.index({ username: 1 });
userSchema.index({ omniflixAddress: 1 });
userSchema.index({ isSubscribe: 1 });

const model = omniflixMarketplaceBot.model('User', userSchema)
    .on('index', (error) => {
        if (error) {
            logger.error(error);
        }
    })

model.syncIndexes().then().catch(logger.error);

module.exports = model;
