const dotenv = require('dotenv').config()
const https = require('https')

const { userData } = require('../models/user.model');
const { ActivityData } = require("../models/activity.model");

let createAuctionHelper = async (activity) => {
    // console.log(activities)
    let user_chatId = []
    await userData.find({
        "isSubscribe": true
    }, async (error, result) => {
        if (error) {
            return console.log(error)
        } else if (result && result.length) {
            user_chatId.splice(0,)
            result.forEach(user => {
                user_chatId.push(user.userId)
            })
        } else {
            return console.log("no User subscribed")
        }
    }).clone()
    // await userData.distinct("userId",{
    //     "isSubscribe": true
    // }, async (error, result) => {
    //     console.log(error,result)
    //     if (error) {
    //         return console.log(error)
    //     } else if (result && result.length) {
    //         console.log(result)
    //         // user_chatId.splice(0,)
    //         // result.forEach(user => {
    //         //     user_chatId.push(user.userId)
    //         // })
    //     } else {
    //         return console.log("no User subscribed")
    //     }
    // }).clone()
    console.log(user_chatId)
    let msg = `***New Auction Listed On MarketPlace***
    **Click the below Link:**
    (https://omniflix.market/nft/${activity.nft_id.id})
    The Auction is Starting at:
    ***${new Date(activity.start_time)}*** 
    And The Auction is Ending at:
    ***${new Date(activity.end_time)}*** `
    user_chatId.forEach((chatid) => {
        let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${chatid}&text=${msg}&parse_mode=markdown`
        console.log("target", target)
        https.get(target, (res) => {
            return console.log('Auction Telegram Notification sent')
        })
    })
    ActivityData.findOneAndUpdate({
        "_id": activity._id
    }, {
        $set: {
            "isNotified": true,
        }
    }, async (error) => {
        if (error) {
            return console.log(error)
        }
    })


}

let cancelAuctionHelper = async (activity) => {
    // console.log(activities)
    let user_chatId = []
    await userData.find({
        "isSubscribe": true
    }, async (error, result) => {
        if (error) {
            return console.log(error)
        } else if (result && result.length) {
            user_chatId.splice(0,)
            result.forEach(user => {
                user_chatId.push(user.userId)
            })
        } else {
            return console.log("no User subscribed")
        }
    }).clone()
    // console.log(user_chatId)
    let msg = ` ***Auction Cancelled.***
    **Click the below Link:**
    (https://omniflix.market/nft/${activity.nft_id.id})`
    user_chatId.forEach((chatid) => {
        let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${chatid}&text=${msg}&parse_mode=markdown`
        // console.log("target",target)
        https.get(target, (res) => {
            return console.log('Cancelled Auction Telegram Notification sent')
        })
    })
    ActivityData.findOneAndUpdate({
        "nftId": activity.nft_id.id,
        "tx_hash": activity.tx_hash,
        "id": activity.id
    }, {
        $set: {
            "isNotified": true,
        }
    }, async (error) => {
        if (error) {
            return console.log(error)
        }
    })


}

let removeAuctionHelper = async (activity) => {

    let user_chatId = []
    await userData.find({
        "isSubscribe": true
    }, async (error, result) => {
        if (error) {
            return console.log(error)
        } else if (result && result.length) {
            user_chatId.splice(0,)
            result.forEach(user => {
                user_chatId.push(user.userId)
            })
        } else {
            return console.log("no User subscribed")
        }
    }).clone()
    // console.log(user_chatId)
    let msg = ` ***Auction Removed From Marketplace.***
    **Click the below Link:**
    (https://omniflix.market/nft/${activity.nft_id.id})`
    user_chatId.forEach((chatid) => {
        let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${chatid}&text=${msg}&parse_mode=markdown`
        // console.log("target",target)
        https.get(target, (res) => {
            return console.log('Removed Auction Telegram Notification sent')
        })
    })
    ActivityData.findOneAndUpdate({
        "nftId": activity.nft_id.id,
        "id": activity.id,
        "type": activity.type
    }, {
        $set: {
            "isNotified": true,
        }
    }, async (error) => {
        if (error) {
            return console.log(error)
        }
    })


}

let processBidAuctionHelper = async (activity) => {
    // console.log(activity)
    let user_chatIdBidder
    let user_omniflixAddressBidder
    let user_chatIdOwner
    let user_omniflixAddressOwner

    await userData.findOne({
        "isSubscribe": true,
        "omniflixAddress": activity.bidder
    },async(error, result) => {
        if (error) {
            return console.log(error)
        } else if (result) {
            user_chatIdBidder =result.userId
            user_omniflixAddressBidder =result.omniflixAddress
            
        } else {
            return console.log("Process bid Bidder not subscribed")
        }
    }).clone()

    await userData.findOne({
        "isSubscribe": true,
        "omniflixAddress": activity.owner
    },async(error, result)=>{
        if (error) {
            return console.log(error)
        } else if (result) {
            user_chatIdOwner =result.userId
            user_omniflixAddressOwner=result.omniflixAddress
        } else {
            return console.log("Process bid Owner Not subscribed")
        }
    }).clone()

    // console.log(user_omniflixAddressOwner, user_omniflixAddressBidder, user_chatIdOwner, user_chatIdBidder)

    if(user_omniflixAddressBidder != undefined && user_chatIdBidder != undefined){
        let msg = ` **Congratulations**.
        ***You Won the Following Auction:***
        (https://omniflix.market/nft/${activity.nft_id.id})`
        let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdBidder}&text=${msg}&parse_mode=markdown`
        https.get(target, (res) => {
            return console.log('Auction Won Telegram Notification sent')
        })
        ActivityData.findOneAndUpdate({
            "_id":activity._id
        }, {
            $set: {
                "isNotified": true,
            }
        }, async (error) => {
            if (error) {
                return console.log(error)
            }
        })
    }

    if(user_omniflixAddressOwner != undefined && user_chatIdOwner != undefined){
        let msg = ` ***The Auction has Ended :***
        (https://omniflix.market/nft/${activity.nft_id.id})`
        let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdOwner}&text=${msg}&parse_mode=markdown`
        https.get(target, (res) => {
            return console.log('Auction Ended Telegram Notification sent')
        })
        ActivityData.findOneAndUpdate({
            "_id":activity._id
        }, {
            $set: {
                "isNotified": true,
            }
        }, async (error) => {
            if (error) {
                return console.log(error)
            }
        })
    }
    

}

// let placeBidAuctionHelper = async (activity)=>{
//     try{
//         let id = activity._id;
//         // let id = activity;

//         let activityData = await ActivityData.findOne({_id:id});
//         if(!activityData){
//             return "Activity not found"
//         } 

//         if(!activityData.type=="MsgPlaceBid"){
//             return "Not valid message type for this helper"
//         }

//         if(activityData.isNotified == "true"){
//             return "Already Notified"
//         }

//         let nftId = activityData.nft_id.id;
        
//         let ownerData = await userData.findOne({
//             isSubscribed:true,
//             omniflixAddress:activityData.nft_id.owner          
//         })

//         if(ownerData){

//             let ownerMsg = ` ***New bid placed on your auction to check.***
//             **Click the below Link:**
//             (https://omniflix.market/nft/${nftId})`

//             let ownerTarget =  `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${ownerData.userId}&text=${ownerMsg}&parse_mode=markdown`
            
//             https.get(ownerTarget,(res)=>{
//                 console.log("Notification sent")
//             })
//         }

//         let bidderData = await userData.findOne({
//             isSubscribed:true,
//             omniflixAddress:activityData.bidder
//         })

//         if(bidderData){

//             let bidderMsg = ` ***You have placed a new bid on the below to check.***
//             **Click the below Link:**
//             (https://omniflix.market/nft/${nftId})`

//             let bidderTarget =  `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${bidderData.userId}&text=${bidderMsg}&parse_mode=markdown`

//             https.get(bidderTarget,(res)=>{
//                 console.log("Notification sent")
//             })
//         }

//         // if(await ActivityData.find({auction_id:activityData.auction_id}).length > 1){
//         //     console.log("greater than 1")

//         // }

//         let previousBidder = await ActivityData.find({
//             auction_id:activityData.auction_id
//         }).sort({'amount.amount':-1}).limit(2);
//         // console.log(previousBidder)

//         if(previousBidder.length > 1){
            
//             // console.log(previousBidder[1].bidder)
//             let previousBidderData = await userData.findOne({
//                 isSubscribed:true,
//                 omniflixAddress:previousBidder[1].bidder
//             })

//             // console.log(previousBidderData);

//             if(previousBidderData){
//                 let previousBidderMsg = ` ***Your Bid has been overbidden to check. *** 
//                 **Click the below Link**
//                 (https://omniflix.market/nft/${nftId})`
//                 let previousBidderTarget = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${previousBidderData.userId}&text=${previousBidderMsg}&parse_mode=markdown`
//                 https.get(previousBidderTarget,(res)=>{
//                     console.log("Notification sent");
//                 })
//             }
//         }
//         await ActivityData.findOneAndUpdate({
//             _id:id},{
//             $set:{
//                 isNotified:true
//             }
        
//         })
  
//     }catch(error){
//         console.log(error)
        
        
//     }

// }

let placeBidAuctionHelper = async (activity)=>{
    try{
        console.log("price bid helper working")
        
        let id = activity._id;
        // let id = activity;
        

        let activityData = await ActivityData.findOne({_id:id});
        if(!activityData){
           console.log("Activity not found")
        }

        let nftId = activityData.nft_id.id;
        
        
        

        let ownerData = await userData.find({
            isSubscribe:true,
            omniflixAddress:activityData.nft_id.owner          
        })

        



        if(ownerData.length){

            ownerData.forEach((data)=>{

             
                let ownerMsg = ` ***New bid placed on your auction to check.***
                            **Click the below Link:**
                            (https://omniflix.market/nft/${nftId})`;

                let ownerTarget =  `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${data.userId}&text=${ownerMsg}&parse_mode=markdown`
                
                https.get(ownerTarget,(res)=>{
                    console.log("Notification sent")
                })  
            })   
        
        }

        

        let bidderData = await userData.find({
            isSubscribe:true,
            omniflixAddress:activityData.bidder
        })

        if(bidderData.length){
            bidderData.forEach((data)=>{
                let bidderMsg = ` ***You have placed a new bid on the below to check.***
                            **Click the below Link:**
                            (https://omniflix.market/nft/${nftId})`;

                let bidderTarget =  `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${data.userId}&text=${bidderMsg}&parse_mode=markdown`

                https.get(bidderTarget,(res)=>{
                    console.log("Notification sent")
                })
            })
        }

      

        

        let previousBidder = await ActivityData.find({
            auction_id:activityData.auction_id
        }).sort({'amount.amount':-1}).limit(2);

        
        

        if(previousBidder.length > 1){
            
            
            let previousBidderData = await userData.find({
                isSubscribe:true,
                omniflixAddress:previousBidder[1].bidder
            })

            

            if(previousBidderData.length){


                previousBidderData.forEach((data)=>{

                    if(previousBidderData){
                        let previousBidderMsg = ` ***Your Bid has been overbidden to check. *** 
                                        **Click the below Link**
                                        (https://omniflix.market/nft/${nftId})`;
                        let previousBidderTarget = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${data.userId}&text=${previousBidderMsg}&parse_mode=markdown`
                        https.get(previousBidderTarget,(res)=>{
                            console.log("Notification sent");
                        })
                    }

                })
            }    
 
        }

        await ActivityData.findOneAndUpdate({
            _id:id
            },{
                $set:{
                    isNotified:true
                }
            })

        



        

        
    }catch(error){
        console.log(error)
        
        
    }

}
module.exports = {
    createAuctionHelper,
    cancelAuctionHelper,
    removeAuctionHelper,
    processBidAuctionHelper,
    placeBidAuctionHelper
}

