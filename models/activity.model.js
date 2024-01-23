var mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    module: {
        type: String,
    },
    type: {
        type: String,
    },
    tx_hash: {
        type: String,
    },
    block: {
        type: Number,
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
    status: {
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
    remaining_deposit: {
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
        type: Object,
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
        type: Object,
    },
    claimer: {
        type: String,
    },
    claimed_nft: {
        type: Object,
    },
    nft: {
        type: Object,
    },
    stream: {
        type: Object,
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
    verified: {
        type: Boolean,
    },
    flixdrop: {
        type: Boolean,
    },
    ibc_in: {
        type: Object,
    },
    ibc_out: {
        type: Object,
    },
    uri: {
        type: String,
    },
    uri_hash: {
        type: String,
    },
    original_media_uri: {
        type: String,
    },
    is_native: {
        type: Boolean,
    },
    is_away: {
        type: Boolean,
    },
    is_listed: {
        type: Boolean,
    },
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
    },
    isNotified: {
        type: Boolean,
    }
});


var ActivityData = mongoose.model('activity', activitySchema);

module.exports = {
    ActivityData: ActivityData,
};
