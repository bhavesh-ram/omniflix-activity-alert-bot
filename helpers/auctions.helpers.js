const dotenv = require('dotenv').config()
const https = require('https')
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.token);

const { userData } = require('../models/user.model');
const { ActivityData } = require("../models/activity.model");
const { createAuctionMsg, cancelAuctionMsg, removeAuctionMsg, processBidAuctionHelperMsg, placeBidAuctionHelperMsg } = require("../src/template.js")


String.prototype.fmt = function (hash) {
    var string = this, key; for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); return string
}


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


    let msg = createAuctionMsg.message.fmt({ ACTIVITYNFT_IDID: activity.nft_id.id, START_DATE: activity.start_time, END_DATE: activity.end_time })
    let mediaUrl =createAuctionMsg.url.fmt({ ACTIVITYNFT_IDID: activity.nft_id.id})
    user_chatId.forEach((chatid) => {
        console.log(user_chatId)

        // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${chatid}&text=${msg}&parse_mode=markdown`
        // console.log("target", target)
        // https.get(target, (res) => {
        //     return console.log('Auction Telegram Notification sent')
        // })

        bot.telegram.sendMessage(chatid,msg,{
            parse_mode:'Markdown',
            reply_markup:{
                inline_keyboard:[
                    [
                        {text:"New Auction Created",url:mediaUrl}
                    ]
                ]
            }
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
    let user_chatIdOwner
    let user_omniflixAddressOwner

    await userData.findOne({
        "isSubscribe": true,
        "omniflixAddress": activity.owner
    }, async (error, result) => {
        if (error) {
            return console.log(error)
        } else if (result) {
            user_chatIdOwner = result.userId
            user_omniflixAddressOwner = result.omniflixAddress

        } else {
            return console.log("Cancel Auction user not subscribed")
        }
    }).clone()


    if (user_omniflixAddressOwner != undefined && user_chatIdOwner != undefined) {
       
        let msg = cancelAuctionMsg.message.fmt({ ACTIVITYNFT_IDID: activity.nft_id.id })
        let mediaUrl = cancelAuctionMsg.url.fmt({ ACTIVITYNFT_IDID: activity.nft_id.id })

        // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdOwner}&text=${msg}&parse_mode=markdown`
        // console.log("target", target)
        // https.get(target, (res) => {
        //     return console.log('Cancelled Auction Telegram Notification sent')
        // })

        bot.telegram.sendMessage(user_chatIdOwner,msg,{
            parse_mode:'Markdown',
            reply_markup:{
                inline_keyboard:[
                    [
                        {text:"Auction Cancelled",url:mediaUrl}
                    ]
                ]
            }
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
   


}

let removeAuctionHelper = async (activity) => {

    let user_chatIdOwner
    let user_omniflixAddressOwner

    await userData.findOne({
        "isSubscribe": true,
        "omniflixAddress": activity.owner
    }, async (error, result) => {
        if (error) {
            return console.log(error)
        } else if (result) {
            user_chatIdOwner = result.userId
            user_omniflixAddressOwner = result.omniflixAddress

        } else {
            return console.log("Cancel Auction user not subscribed")
        }
    }).clone()
    
    if (user_omniflixAddressOwner != undefined && user_chatIdOwner != undefined) {
       
        let msg = removeAuctionMsg.message.fmt({ ACTIVITYNFT_IDID: activity.nft_id.id })
        let mediaUrl = removeAuctionMsg.url.fmt({ ACTIVITYNFT_IDID: activity.nft_id.id })

        // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdOwner}&text=${msg}&parse_mode=markdown`
        // console.log("target", target)
        // https.get(target, (res) => {
        //     return console.log('Removed Auction Telegram Notification sent')
        // })

        bot.telegram.sendMessage(user_chatIdOwner,msg,{
            parse_mode:'Markdown',
            reply_markup:{
                inline_keyboard:[
                    [
                        {text:"Auction Removed",url:mediaUrl}
                    ]
                ]
            }
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
    }, async (error, result) => {
        if (error) {
            return console.log(error)
        } else if (result) {
            user_chatIdBidder = result.userId
            user_omniflixAddressBidder = result.omniflixAddress

        } else {
            return console.log("Process bid Bidder not subscribed")
        }
    }).clone()

    await userData.findOne({
        "isSubscribe": true,
        "omniflixAddress": activity.owner
    }, async (error, result) => {
        if (error) {
            return console.log(error)
        } else if (result) {
            user_chatIdOwner = result.userId
            user_omniflixAddressOwner = result.omniflixAddress
        } else {
            return console.log("Process bid Owner Not subscribed")
        }
    }).clone()

    // console.log(user_omniflixAddressOwner, user_omniflixAddressBidder, user_chatIdOwner, user_chatIdBidder)

    if (user_omniflixAddressBidder != undefined && user_chatIdBidder != undefined) {
       
        let msg = processBidAuctionHelperMsg.auctionWonMsg.fmt({ ACTIVITYNFT_IDID: activity.nft_id.id })
        let mediaUrl = processBidAuctionHelperMsg.url.fmt({ ACTIVITYNFT_IDID: activity.nft_id.id })



        // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdBidder}&text=${msg}&parse_mode=markdown`
        // https.get(target, (res) => {
        //     return console.log('Auction Won Telegram Notification sent')
        // })

        bot.telegram.sendMessage(user_chatIdBidder,msg,{
            parse_mode:'Markdown',
            reply_markup:{
                inline_keyboard:[
                    [
                        {text:"Auction Won",url:mediaUrl}
                    ]
                ]
            }
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

    if (user_omniflixAddressOwner != undefined && user_chatIdOwner != undefined) {
        
        let msg = processBidAuctionHelperMsg.auctionEndMsg.fmt({ ACTIVITYNFT_IDID: activity.nft_id.id })
        let mediaUrl = processBidAuctionHelperMsg.url.fmt({ ACTIVITYNFT_IDID: activity.nft_id.id })

        // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdOwner}&text=${msg}&parse_mode=markdown`
        // https.get(target, (res) => {
        //     return console.log('Auction Ended Telegram Notification sent')
        // })

        bot.telegram.sendMessage(user_chatIdOwner,msg,{
            parse_mode:'Markdown',
            reply_markup:{
                inline_keyboard:[
                    [
                        {text:"Auction Ended",url:mediaUrl}
                    ]
                ]
            }
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


}


let placeBidAuctionHelper = async (activity) => {
    try {
        // console.log("price bid helper working")

        let id = activity._id;
        // let id = activity;


        let activityData = await ActivityData.findOne({ _id: id });
        if (!activityData) {
            console.log("Activity not found")
        }

        let nftId = activityData.nft_id.id;




        let ownerData = await userData.find({
            isSubscribe: true,
            omniflixAddress: activityData.nft_id.owner
        })





        if (ownerData.length) {

            ownerData.forEach((data) => {


                // let ownerMsg = ` ***New bid placed on your auction to check.***
                //             **Click the below Link:**
                //             (https://omniflix.market/nft/${nftId})`;
                let ownerMsg = placeBidAuctionHelperMsg.ownerMsg.fmt({ NFTID: nftId })
                let mediaUrl = placeBidAuctionHelperMsg.url.fmt({ NFTID: nftId })

                // let ownerTarget = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${data.userId}&text=${ownerMsg}&parse_mode=markdown`

                // https.get(ownerTarget, (res) => {
                //     console.log("Notification sent")
                // })

                bot.telegram.sendMessage(data.userId,ownerMsg,{
                    parse_mode:'Markdown',
                    reply_markup:{
                        inline_keyboard:[
                            [
                                {text:"New Bid Placed",url:mediaUrl}
                            ]
                        ]
                    }
                })
            })

            await ActivityData.findOneAndUpdate({
                _id: id
            }, {
                $set: {
                    isNotified: true
                }
            })

        }



        let bidderData = await userData.find({
            isSubscribe: true,
            omniflixAddress: activityData.bidder
        })

        if (bidderData.length) {
            bidderData.forEach((data) => {
                // let bidderMsg = ` ***You have placed a new bid on the below to check.***
                //             **Click the below Link:**
                //             (https://omniflix.market/nft/${nftId})`;

                let bidderMsg = placeBidAuctionHelperMsg.bidderMsg.fmt({ NFTID: nftId })
                let mediaUrl = placeBidAuctionHelperMsg.url.fmt({ NFTID: nftId })
                // let bidderTarget = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${data.userId}&text=${bidderMsg}&parse_mode=markdown`

                // https.get(bidderTarget, (res) => {
                //     console.log("Notification sent")
                // })

                bot.telegram.sendMessage(data.userId,bidderMsg,{
                    parse_mode:'Markdown',
                    reply_markup:{
                        inline_keyboard:[
                            [
                                {text:"You Placed New Bid",url:mediaUrl}
                            ]
                        ]
                    }
                })
            })

            await ActivityData.findOneAndUpdate({
                _id: id
            }, {
                $set: {
                    isNotified: true
                }
            })
        }





        let previousBidder = await ActivityData.find({
            auction_id: activityData.auction_id
        }).sort({ 'amount.amount': -1 }).limit(2);




        if (previousBidder.length > 1) {


            let previousBidderData = await userData.find({
                isSubscribe: true,
                omniflixAddress: previousBidder[1].bidder
            })



            if (previousBidderData.length) {


                previousBidderData.forEach((data) => {

                    if (previousBidderData) {
                        // let previousBidderMsg = ` ***Your Bid has been overbidden to check. *** 
                        //                 **Click the below Link**
                        //                 (https://omniflix.market/nft/${nftId})`;
                        let previousBidderMsg = placeBidAuctionHelperMsg.previousBidderMsg.fmt({ NFTID: nftId })
                        let mediaUrl = placeBidAuctionHelperMsg.url.fmt({ NFTID: nftId })

                        // let previousBidderTarget = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${data.userId}&text=${previousBidderMsg}&parse_mode=markdown`
                        // https.get(previousBidderTarget, (res) => {
                        //     console.log("Notification sent");
                        // })

                        bot.telegram.sendMessage(data.userId,previousBidderMsg,{
                            parse_mode:'Markdown',
                            reply_markup:{
                                inline_keyboard:[
                                    [
                                        {text:"Bid Overbidden",url:mediaUrl}
                                    ]
                                ]
                            }
                        })
                    }

                })

                await ActivityData.findOneAndUpdate({
                    _id: previousBidder[1]._id
                }, {
                    $set: {
                        isNotified: true
                    }
                })


            }

           

        }










    } catch (error) {
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

