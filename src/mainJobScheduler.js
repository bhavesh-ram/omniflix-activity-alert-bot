let request = require("request")
var cron = require('node-cron');
const dotenv = require('dotenv').config()
const { ActivityData } = require("../models/activity.model");
const { createAuctionHelper, cancelAuctionHelper, removeAuctionHelper, processBidAuctionHelper, placeBidAuctionHelper } = require("../helpers/auctions.helpers");
const { listingHelper, deListingHelper } = require("../helpers/listings.helpers");
const { transferNftHelper } = require("../helpers/transferNft.helper");
const { buyNftHelper, burnNftHelper, mintONFTHelper } = require("../helpers/buyNfts.helpers");
const { updateDenomHelper, transferDenomHelper } = require("../helpers/denoms.helper");


let MainScheduler = async () =>{
    await ActivityData.find({
        "isNotified":false    
    }, {}, {
        sort: {
            created_at: 'desc'
        },
        limit: 5
    }, async (error, activities) => {
        // console.log(activities)
        if (error) {
            console.log(error)
        }else if(activities && activities.length){
            activities.forEach((activity) =>{
                if(activity.type == "MsgCreateAuction"){
                    createAuctionHelper(activity)
                }else if(activity.type == "MsgListNFT"){
                    listingHelper(activity)
                }else if(activity.type == "MsgCancelAuction"){
                    cancelAuctionHelper(activity)
                }else if(activity.type == "RemoveAuction"){
                    removeAuctionHelper(activity)
                }else if(activity.type == "ProcessBid"){
                    processBidAuctionHelper(activity)
                }else if(activity.type == "MsgPlaceBid"){
                    placeBidAuctionHelper(activity)
                }else if(activity.type == "MsgTransferONFT"){
                    transferNftHelper(activity)
                }else if(activity.type == "MsgBuyNFT"){
                    buyNftHelper(activity)
                 }else if(activity.type == "MsgDeListNFT"){
                    deListingHelper(activity)
                 }else if(activity.type == "MsgBurnONFT"){
                    burnNftHelper(activity)
                 }else if(activity.type == "MsgUpdateDenom"){
                    updateDenomHelper(activity)
                 }else if(activity.type == "MsgTransferDenom"){
                    transferDenomHelper(activity)
                 }else if(activity.type == "MsgMintONFT"){
                    mintONFTHelper(activity)
                 }
            })

        }
    })
}


let mainSchedulerData = cron.schedule('*/10 * * * * *', MainScheduler)

module.exports ={
    mainSchedulerData
}