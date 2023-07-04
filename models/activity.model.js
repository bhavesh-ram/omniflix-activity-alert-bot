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
    interaction: {
        type: String,
    },
    claim_type: {
        type: String,
    },
    nft_denom_id: {
        type: String,
    },
    denom: {
        type: String,
    },
    tokens_per_claim: {
        denom: {
            type: String,
        },
        amount: {
            type: Number,
        },
    },
    max_allowed_claims: {
        type: Number,
    },
    deposit: {
        denom: {
            type: String,
        },
        amount: {
            type: Number,
        },
    },
    nft_mint_details: {
        type: Object,
    },
    distribution: {
        type: {
            type: String,
        },
        stream_duration: {
            type: String,
        },
    },
    creation_fee: {
        denom: {
            type: String,
        },
        amount: {
            type: Number,
        },
    },
    campaign_id: {
        type: String,
    },
    campaign: {
        type: String,
    },
    claimer: {
        type: String,
    },
    claimed_nft: {
        type: String,
    },
    nft: {
        type: String,
    },
    stream: {
        type: String,
    },
    stream_type: {
        type: String,
    },
    return_amount: {
        denom: {
            type: String,
        },
        amount: {
            type: Number,
        },
    },
    claimed_amount: {
        denom: {
            type: String,
        },
        amount: {
            type: Number,
        },
    },
    claims_count: {
        type: Number,
    },
    periods: {
        type: mongoose.Schema.Types.Mixed,
        default: [],
    },
    cancellable: {
        type: Boolean,
    },
    last_claimed_at: {
        type: Date,
    },
    claim_settlement_type: {
        type: String,
    },
    stream_id: {
        type: String,
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
