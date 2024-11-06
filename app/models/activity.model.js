const mongoose = require('mongoose');
const { omniflixMarketplaceBot } = require('../../database');
const logger = require('../../logger');

const activitySchema = new mongoose.Schema({
    module: {
        type: String,
    },
    type: {
        type: String,
    },
    label: {
        type: String,
    },
    contract_address: {
        type: String,
    },
    admin: {
        type: String,
    },
    tx_hash: {
        type: String,
    },
    block: {
        type: Number,
    },
    _id: {
        type: mongoose.Schema.Types.ObjectId,
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
    funds: {
        type: mongoose.Schema.Types.Mixed,
    },
    price: {
        denom: {
            type: String,
        },
        amount: {
            type: Number,
        },
    },
    code: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        index: {
            type: Boolean,
        },
        created_at: {
            type: Date,
        },
        updated_at: {
            type: Date,
        },
        code_id: {
            type: String,
        },
        code_checksum: {
            type: String,
        },
        sender: {
            type: String,
        }
    },
    code_id: {
        type: String,
    },
    code_checksum: {
        type: String,
    },
    index: {
        type: Boolean,
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
    },
    bidder: {
        type: String,
    },
    auction_id: {
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
    num_tokens: {
        type: Number,
    },
    msg: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        minted_tokens: {
            type: Number,
        },
        pausers: {
            type: mongoose.Schema.Types.Mixed,
        },
        admin: {
            type: String,
        },
        fee_collector_address: {
            type: String,
        },
        whitelist_address: {
            type: String,
        },
        product_label: {
            type: String,
        },
        minter_code_id: {
            type: String,
        },
        minter_creation_fee: {
            denom: {
                type: String,
            },
            amount: {
                type: Number,
            },
        },
        start_time: {
            type: Date,
        },
        num_tokens: {
            type: Number,
        },
        remaining_tokens: {
            type: Number,
        },
        mint_price: {
            amount: {
                type: Number,
            },
            denom: {
                type: String,
            }
        },
        collection_details: {
            type: Object,
        },
        token_details: {
            type: Object,
        },
        oem_product_label: {
            type: String,
        },
        open_edition_minter_code_id: {
            type: String,
        },
        open_edition_minter_creation_fee: {
            denom: {
                type: String,
            },
            amount: {
                type: Number,
            },
        },
        whitelist_code_id: {
            type: String,
        },
        whitelist_creation_fee: {
            denom: {
                type: String,
            },
            amount: {
                type: Number,
            },
        },
        multi_minter_code_id: {
            type: String,
        },
        multi_minter_creation_fee: {
            denom: {
                type: String,
            },
            amount: {
                type: Number,
            },
        },
        multi_minter_product_label: {
            type: String,
        },
    },
    remaining_tokens: {
        type: Number,
    },
    mint_price: {
        amount: {
            type: Number,
        },
        denom: {
            type: String,
        },
    },
    is_multi_mint: {
        type: Boolean,
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
    minted_tokens: {
        type: Number,
    },
    nft_mint_details: {
        type: Object,
    },
    token_details: {
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
        _id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        total_royalty: {
            usd: { type: Number },
            inr: { type: Number }
        },
        name: {
            type: String,
        },
        status: {
            type: String,
        },
        is_listed: {
            type: Boolean,
        },
        is_native: {
            type: Boolean,
        },
        is_away: {
            type: Boolean,
        },
        created_at: {
            type: Date,
        },
        updated_at: {
            type: Date,
        },
        id: {
            type: String,
        },
        denom: {
            type: String,
        },
        denom_id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        transferable: {
            type: Boolean,
        },
        extensible: {
            type: Boolean,
        },
        nsfw: {
            type: Boolean,
        },
        owner: {
            type: String,
        },
        creator: {
            type: String,
        },
        media_uri: {
            type: String,
        },
        data: {
            type: String,
        },
        description: {
            type: String,
        },
        royalty_share: {
            type: Number,
        },
        preview_uri: {
            type: String,
        }
    },
    denom: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        total_royalty: {
            usd: { type: Number },
            inr: { type: Number }
        },
        verified: {
            type: Boolean,
        },
        featured: {
            type: Boolean,
        },
        featured_position: {
            type: Number,
        },
        IP_infringement: {
            type: Boolean,
        },
        on_launchpad: {
            type: Boolean,
        },
        status: {
            type: String,
        },
        total_nfts: {
            type: Number,
        },
        unique_owners: {
            type: Number,
        },
        total_lists: {
            type: Number,
        },
        total_auctions: {
            type: Number,
        },
        active_auctions: {
            type: Number,
        },
        active_listings: {
            type: Number,
        },
        uri: {
            type: String,
        },
        uri_hash: {
            type: String,
        },
        data: {
            type: String,
        },
        is_native: {
            type: Boolean,
        },
        is_contract_owned: {
            type: Boolean,
        },
        created_at: {
            type: Date,
        },
        updated_at: {
            type: Date,
        },
        id: {
            type: String,
        },
        name: {
            type: String,
        },
        symbol: {
            type: String,
        },
        creator: {
            type: String,
        },
        schema: {
            type: String,
        },
        description: {
            type: String,
        },
        preview_uri: {
            type: String,
        },
        ibc_out: {
            type: mongoose.Schema.Types.Mixed,
        },
        contract_owner: {
            type: String,
        },
        minter_contract: {
            type: String,
        },
        minter_contract_address: {
            type: String,
        },
        royalty_receivers: {
            type: mongoose.Schema.Types.Mixed,
        }
    },
    contract_denom_id: {
        type: String,
    },
    contract_nft_id: {
        type: String,
    },
    admin_mint: {
        type: Boolean,
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
    collection_schema: {
        type: String,
    },
    claims_count: {
        type: Number,
    },
    periods: {
        type: mongoose.Schema.Types.Mixed,
    },
    royalty_receivers: {
        type: mongoose.Schema.Types.Mixed,
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
    drop_id: {
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
        default: false,
    },
    contract_type: {
        type: String,
    },
    minter_contract_address: {
        type: String,
    },
    contract: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        created_at: {
            type: Date,
        },
        updated_at: {
            type: Date,
        },
        contract_address: {
            type: String,
        },
        code_id: {
            type: String,
        },
        sender: {
            type: String,
        },
        admin: {
            type: String,
        },
        label: {
            type: String,
        },
        funds: {
            type: mongoose.Schema.Types.Mixed,
        },
        msg: {
            type: Object,
        },
        code: {
            type: String,
        }
    },
    is_paused: {
        type: Boolean,
    },
    minter_contract: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        is_paused: {
            type: Boolean,
        },
        is_multi_mint: {
            type: Boolean,
        },
        created_at: {
            type: Date,
        },
        updated_at: {
            type: Date,
        },
        type: {
            type: String,
        },
        minter_contract_address: {
            type: String,
        },
        code_id: {
            type: String,
        },
        sender: {
            type: String,
        },
        contract_address: {
            type: String,
        },
        funds: {
            type: mongoose.Schema.Types.Mixed,
        },
        name: {
            type: String,
        },
        version: {
            type: String,
        },
        msg: {
            type: Object,
        },
        code: {
            type: String,
        },
        contract: {
            type: String,
        }
    },
    royalty_receivers: [{
        address: {
            type: String,
        },
        weight: {
            type: String,
        }
    }],
    contract_owner: {
        type: String,
    },
    whitelist_contract_address: {
        type: String,
    },
    whitelist_address: {
        type: String,
    },
    rounds: {
        type: mongoose.Schema.Types.Mixed,
    },
    per_address_limit: {
        type: Number,
    },
    __v: {
        type: Number,
    }
});

const model = omniflixMarketplaceBot.model('activity', activitySchema)
    .on('index', (error) => {
        if (error) {
            logger.error(error);
        }
    });

model.syncIndexes().then().catch(logger.error);

module.exports = model
