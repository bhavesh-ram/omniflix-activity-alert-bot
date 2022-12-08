var mongoose = require('mongoose');

var auctionSchema = mongoose.Schema({
    auctionId: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    nftId: {
        type: String,
        required: true,
    },
    isNotified: {
        type: Boolean,
        default: false,
    }
    
    
}, { timestamps: true });

var auctionData = mongoose.model('auction', auctionSchema);
module.exports = {
    auctionData: auctionData,
};