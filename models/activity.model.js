var mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    module: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    tx_hash: {
        type: String,
        required: true,
    },
    block: {
        type: Number,
        required: true,
    },
    id: {
        type: String,
    },
    symbol: {
        type: String,
    },
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    schema: {
        type: String,
    },
    preview_uri: {
        type: String,
    },
    media_uri: {
        type: String,
    },
    creator: {
        type: String,
    },
    nft_id: {
        type: Object,
    },
    denom_id: {
        type: Object,
    },
    price: {
        denom: {
            type: String,
        },
        amount: {
            type: Number,
        },
    },
    owner: {
        type: String,
    },
    buyer: {
        type: String,
    },
    sender: {
        type: String,
    },
    recipient: {
        type: String,
    },
    data: {
        type: String,
    },
    media_type: {
        type: String,
    },
    transferable: {
        type: Boolean,
    },
    extensible: {
        type: Boolean,
    },
    royalty_share: {
        type: Number,
        min: 0,
        max: 1,
    },
    nsfw: {
        type: Boolean,
    },
    split_shares: {
        type: mongoose.Schema.Types.Mixed,
        default: [],
    },
    start_price: {
        denom: {
            type: String,
        },
        amount: {
            type: Number,
        },
    },
    duration: {
        type: String,
    },
    start_time: {
        type: Date,
    },
    end_time: {
        type: Date,
    },
    increment_percentage: {
        type: Number,
    },
    whitelist_accounts: {
        type: mongoose.Schema.Types.Mixed,
        default: [],
    },
    bidder: {
        type: String,
    },
    auction_id: {
        type: Object,
    },
    amount: {
        denom: {
            type: String,
        },
        amount: {
            type: Number,
        },
    },
    created_at: {
        type: Date,
        required: true,
        default: new Date(),
    },
    updated_at: {
        type: Date,
        required: true,
        default: new Date(),
    },
    isNotified: {
        type: Boolean,
        default: false,
    }
});


var ActivityData = mongoose.model('activity', activitySchema);

module.exports = {
    ActivityData: ActivityData,
};
