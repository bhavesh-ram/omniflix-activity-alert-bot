let request = require("request")
var cron = require('node-cron');
const dotenv = require('dotenv').config()
const { ActivityData } = require("../models/activity.model");
const { auctionHelper } = require("../helpers/auctions.helpers");
const { listingHelper } = require("../helpers/listings.helpers");


let MainSheduler = async () =>{
    await ActivityData.find({
        "isNotified":false
    }, {}, {
        sort: {
            created_at: 'desc'
        },
        limit: 4
    }, async (error, activities) => {
        if (error) {
            console.log(error)
        }else if(activities && activities.length){
            activities.forEach(async (activity) =>{
                if(activity.type == "MsgCreateAuction"){
                    // mintHelper(activity)
                    let auctionData = await auctionHelper(activity)
                    console.log("aa",auctionData)
                }else if(activity.type == "MsgPlaceBid"){
                    // mintHelper(activity)
                }else if(activity.type == "MsgListNFT"){
                    listingHelper(activity)

                // }else if(activity.type == "MsgListNFT"){
                //     // mintHelper(activity)
                // }else if(activity.type == "MsgMintONFT"){
                //     // mintHelper(activity)
                // }else if(activity.type == "MsgMintONFT"){
                    // mintHelper(activity)
                }
            })
        }
    })
}


let mainShedulerData = cron.schedule('*/10 * * * * *', MainSheduler)

module.exports ={
    mainShedulerData
}