var mongoose = require('mongoose');
var bidderSchema = mongoose.Schema({
    bidId: {
        type: String,
    },
    status: {
        type: String,
    },
    bidder: {
        type: String,
    },
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
    }
})

var bidsSchema = mongoose.Schema({
    bidId: {
        type: String,
    },
    status: {
        type: String,
    },
    bidder: {
        type: String,
    },
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
    },
    owner: {
        type: String,
    },
    nftId: {
        type: String,
    },
    auctionId: {
        type: String,
    },
    denomId: {
        type: String,
    },
    
    isNotified: {
        type: Boolean,
        default: false,
    }


}, { timestamps: true });

var bidsData = mongoose.model('bids', bidsSchema);
module.exports = {
    bidsData: bidsData,
};