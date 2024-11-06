const mongoose = require('mongoose');
const { omniflixMarketplaceBot } = require('../../database');
const logger = require('../../logger');

const channelSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    profile_picture: {
        type: String,
    },
    metadata: {
        type: Object,
    },
    channel_nft_config: {
        name: {
            type: String,
        },
        description: {
            type: String,
        },
    },
    nft_id: {
        type: String,
    },
    denom_id: {
        type: String,
    },
    publishers: {
        type: Array,
    },
    total_interactive_videos: {
        type: Number,
    },
    total_vods: {
        type: Number,
    },
    creator: {
        type: String,
    },
    status: {
        type: String,
    },
    mint_record: {
        type: String
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

const model = omniflixMarketplaceBot.model('channel', channelSchema)
    .on('index', (error) => {
        if (error) {
            logger.error(error);
        }
    })

model.syncIndexes().then().catch(logger.error);

module.exports = model;
