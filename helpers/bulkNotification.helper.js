const { ActivityData } = require("../models/activity.model");
const { userData } = require('../models/user.model');
const dotenv = require('dotenv').config()
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.token);
const https = require('https')

let bulkMinting = async (activity, totalCount) => {
    let msg = `***You Minted **${totalCount}** Nfts.***`
    let user_chatIdCreator
    let user_omniflixAddressCreator
    await userData.findOne({
        "isSubscribe": true,
        "omniflixAddress": activity.creator
    }, async (error, result) => {
        if (error) {
            return console.log(error)
        } else if (result) {
            user_chatIdCreator = result.userId
            user_omniflixAddressCreator = result.omniflixAddress
        } else {
            return console.log("Bulk Mint Nft Owner Not subscribed")
        }
    }).clone()

    // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdCreator}&text=${msg}&parse_mode=markdown`
    // console.log("target", target)
    // https.get(target, (res) => {
    //     return console.log('Bulk Mint Nft Telegram Notification sent')
    // })

    bot.telegram.sendMessage(user_chatIdCreator,msg,{
        parse_mode:'Markdown',
        reply_markup:{
            inline_keyboard:[
                [
                    {text:"Bulk Mint",url:mediaUrl}
                ]
            ]
        }
    })

    await ActivityData.updateMany({
        type: activity.type,
        block: activity.block
    }, {
        $set: {
            "isNotified": true,
        }
    }, async (error) => {
        if (error) {
            return console.log(error)
        }
    }).clone()
}

let bulkTransfer = async (activity, totalCount) => {
    let msg = `***You Transfered **${totalCount}** Nfts.***`

    let user_chatIdSender
    let user_omniflixAddressSender

    await userData.findOne({
        "isSubscribe": true,
        "omniflixAddress": activity.sender
    }, async (error, result) => {
        if (error) {
            return console.log(error)
        } else if (result) {
            user_chatIdSender = result.userId
            user_omniflixAddressSender = result.omniflixAddress
        } else {
            return console.log("Transfer Nft Owner Not subscribed")
        }
    }).clone()

    // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdSender}&text=${msg}&parse_mode=markdown`
    // https.get(target, (res) => {
    //     return console.log('Bulk Mint Nft Telegram Notification sent')
    // })
    bot.telegram.sendMessage(user_chatIdSender,msg,{
        parse_mode:'Markdown',
        reply_markup:{
            inline_keyboard:[
                [
                    {text:"Bulk Nft Transfer",url:mediaUrl}
                ]
            ]
        }
    })

    await ActivityData.updateMany({
        type: activity.type,
        block: activity.block
    }, {
        $set: {
            "isNotified": true,
        }
    }, async (error) => {
        if (error) {
            return console.log(error)
        }
    }).clone()
}

let bulkListingNft = async (activity, totalCount, user_chatId) => {
    let msg = `**${totalCount}** ***New Listings On MarketPlace.***  https://omniflix.market/nft`
    user_chatId.forEach((chatid) => {
        bot.telegram.sendMessage(chatid,msg,{
            parse_mode:'Markdown',
            reply_markup:{
                inline_keyboard:[
                    [
                        {text:"Bulk Listing",url:mediaUrl}
                    ]
                ]
            }
        })
    })
    
   
    await ActivityData.updateMany({
        type: activity.type,
        block: activity.block
    }, {
        $set: {
            "isNotified": true,
        }
    }, async (error) => {
        if (error) {
            return console.log(error)
        }
    }).clone()
}

let bulkDeListingNft = async (activity, totalCount) => {
    let msg = `**${totalCount}** ***Nfts DeListed From MarketPlace.***`

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
            return console.log("DeListing NFT user not subscribed")
        }
    }).clone()

    if (user_omniflixAddressOwner != undefined && user_chatIdOwner != undefined) {
        // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdOwner}&text=${msg}&parse_mode=markdown`
        // https.get(target, (res) => {
        //     return console.log('Bulk Delisting Telegram Notification sent')
        // })

        bot.telegram.sendMessage(user_chatIdOwner,msg,{
            parse_mode:'Markdown',
            reply_markup:{
                inline_keyboard:[
                    [
                        {text:"Bulk DeListing",url:mediaUrl}
                    ]
                ]
            }
        })
        await ActivityData.updateMany({
            type: activity.type,
            block: activity.block
        }, {
            $set: {
                "isNotified": true,
            }
        }, async (error) => {
            if (error) {
                return console.log(error)
            }
        }).clone()
    }
}

let bulkBurnNft = async (activity, totalCount) => {
    let msg = `***You Burned **${totalCount}** Nfts.***`

    let user_chatIdCreator
    let user_omniflixAddressCreator

    await userData.findOne({
        "isSubscribe": true,
        "omniflixAddress": activity.denom_id.creator
    }, async (error, result) => {
        if (error) {
            return console.log(error)
        } else if (result) {
            user_chatIdCreator = result.userId
            user_omniflixAddressCreator = result.omniflixAddress
        } else {
            return console.log("Bulk Burn Nft Owner Not subscribed")
        }
    }).clone()
    // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdCreator}&text=${msg}&parse_mode=markdown`
    // https.get(target, (res) => {
    //     return console.log('Bulk Burn Nft Telegram Notification sent')
    // })

    bot.telegram.sendMessage(user_chatIdCreator,msg,{
        parse_mode:'Markdown',
        reply_markup:{
            inline_keyboard:[
                [
                    {text:"Bulk Burn",url:mediaUrl}
                ]
            ]
        }
    })

    await ActivityData.updateMany({
        type: activity.type,
        block: activity.block
    }, {
        $set: {
            "isNotified": true,
        }
    }, async (error) => {
        if (error) {
            return console.log(error)
        }
    }).clone()
}

let bulkAuction = async (activity, totalCount, user_chatId) => {
    let msg = ` **${totalCount}** ***New Bulk Auction Listed On MarketPlace.***  https://omniflix.market/nft`

    user_chatId.forEach((chatid) => {
        bot.telegram.sendMessage(chatid,msg,{
            parse_mode:'Markdown',
            reply_markup:{
                inline_keyboard:[
                    [
                        {text:"Bulk Auction",url:mediaUrl}
                    ]
                ]
            }
        })
    })

    await ActivityData.updateMany({
        type: activity.type,
        block: activity.block
    }, {
        $set: {
            "isNotified": true,
        }
    }, async (error) => {
        if (error) {
            return console.log(error)
        }
    }).clone()
}

let bulkAuctionCancel = async (activity, totalCount, user_chatId) => {
    let msg = `**${totalCount}** *** Auction Cancel From MarketPlace.***`
    user_chatId.forEach((chatid) => {
        bot.telegram.sendMessage(chatid,msg,{
            parse_mode:'Markdown',
            reply_markup:{
                inline_keyboard:[
                    [
                        {text:"Bulk Auction Cancel",url:mediaUrl}
                    ]
                ]
            }
        })
    })

    await ActivityData.updateMany({
        type: activity.type,
        block: activity.block
    }, {
        $set: {
            "isNotified": true,
        }
    }, async (error) => {
        if (error) {
            return console.log(error)
        }
    }).clone()
}

let bulkAuctionRemoved = async (activity, totalCount, user_chatId) => {
    let msg = `**${totalCount}** ***Auctions Removed From MarketPlace.***`
    user_chatId.forEach((chatid) => {
        bot.telegram.sendMessage(chatid,msg,{
            parse_mode:'Markdown',
            reply_markup:{
                inline_keyboard:[
                    [
                        {text:"Bulk Auction Removed",url:mediaUrl}
                    ]
                ]
            }
        })
    })

    await ActivityData.updateMany({
        type: activity.type,
        block: activity.block
    }, {
        $set: {
            "isNotified": true,
        }
    }, async (error) => {
        if (error) {
            return console.log(error)
        }
    }).clone()
}

let bulkProcessBid = async (activity, totalCount) => {
    let msg = `***You Won **${totalCount}** Auctions.***`

    let user_chatIdBidder
    let user_omniflixAddressBidder

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
            return console.log("Bulk Process Bid Nft Owner Not subscribed")
        }
    }).clone()

    // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdBidder}&text=${msg}&parse_mode=markdown`
    // https.get(target, (res) => {
    //     return console.log('Bulk Mint Nft Telegram Notification sent')
    // })
    bot.telegram.sendMessage(user_chatIdBidder,msg,{
        parse_mode:'Markdown',
        reply_markup:{
            inline_keyboard:[
                [
                    {text:"Bulk Porcess Bid",url:mediaUrl}
                ]
            ]
        }
    })
    await ActivityData.updateMany({
        type: activity.type,
        block: activity.block
    }, {
        $set: {
            "isNotified": true,
        }
    }, async (error) => {
        if (error) {
            return console.log(error)
        }
    }).clone()
}

let bulkPlaceBid = async (activity, totalCount) => {
    let msg = `***You Place **${totalCount}** bids.***`
    let user_chatIdBidder
    let user_omniflixAddressBidder

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
            return console.log("Bulk Place Bid Nft Owner Not subscribed")
        }
    }).clone()
    // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdBidder}&text=${msg}&parse_mode=markdown`
    // https.get(target, (res) => {
    //     return console.log('Bulk Mint Nft Telegram Notification sent')
    // })

    bot.telegram.sendMessage(user_chatIdBidder,msg,{
        parse_mode:'Markdown',
        reply_markup:{
            inline_keyboard:[
                [
                    {text:"Bulk Place Bid",url:mediaUrl}
                ]
            ]
        }
    })
    await ActivityData.updateMany({
        type: activity.type,
        block: activity.block
    }, {
        $set: {
            "isNotified": true,
        }
    }, async (error) => {
        if (error) {
            return console.log(error)
        }
    }).clone()
}

let bulkBuyNft = async (activity, totalCount) => {
    let msg = `***You Bought **${totalCount}** Nfts.***`
    let user_chatIdBuyer
    let user_omniflixAddressBuyer

    await userData.findOne({
        "isSubscribe": true,
        "omniflixAddress": activity.buyer
    }, async (error, result) => {
        if (error) {
            return console.log(error)
        } else if (result) {
            user_chatIdBuyer = result.userId
            user_omniflixAddressBuyer = result.omniflixAddress
        } else {
            return console.log("Bulk Buy Nft Owner Not subscribed")
        }
    }).clone()

    // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdBuyer}&text=${msg}&parse_mode=markdown`
    
    // https.get(target, (res) => {
    //     return console.log('Bulk Buy Nft Telegram Notification sent')
    // })

    bot.telegram.sendMessage(user_chatIdBuyer,msg,{
        parse_mode:'Markdown',
        reply_markup:{
            inline_keyboard:[
                [
                    {text:"Bulk Buy Nfts",url:mediaUrl}
                ]
            ]
        }
    })

    await ActivityData.updateMany({
        type: activity.type,
        block: activity.block
    }, {
        $set: {
            "isNotified": true,
        }
    }, async (error) => {
        if (error) {
            return console.log(error)
        }
    }).clone()
}

let bulkTransferCollection = async (activity, totalCount) => {
    let msg = `***You Transfered **${totalCount}** Collections.***`

    let user_chatIdCreator
    let user_omniflixAddressCreator

    await userData.findOne({
        "isSubscribe": true,
        "omniflixAddress": activity.creator
    }, async (error, result) => {
        if (error) {
            return console.log(error)
        } else if (result) {
            user_chatIdCreator = result.userId
            user_omniflixAddressCreator = result.omniflixAddress
        } else {
            return console.log("Bulk Collection Transfer Owner Not subscribed")
        }
    }).clone()

    // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdCreator}&text=${msg}&parse_mode=markdown`
    
    // https.get(target, (res) => {
    //     return console.log('Bulk Transfer Collection Telegram Notification sent')
    // })

    bot.telegram.sendMessage(user_chatIdCreator,msg,{
        parse_mode:'Markdown',
        reply_markup:{
            inline_keyboard:[
                [
                    {text:"Bulk Transfer Collections",url:mediaUrl}
                ]
            ]
        }
    })

    await ActivityData.updateMany({
        type: activity.type,
        block: activity.block
    }, {
        $set: {
            "isNotified": true,
        }
    }, async (error) => {
        if (error) {
            return console.log(error)
        }
    }).clone()
}

let bulkUpdateCollection = async (activity, totalCount) => {
    let msg = `***You Updated **${totalCount}** Collections.***`

    let user_chatIdCreator
    let user_omniflixAddressCreator

    await userData.findOne({
        "isSubscribe": true,
        "omniflixAddress": activity.creator
    }, async (error, result) => {
        if (error) {
            return console.log(error)
        } else if (result) {
            user_chatIdCreator = result.userId
            user_omniflixAddressCreator = result.omniflixAddress
        } else {
            return console.log("Bulk Collection Update Owner Not subscribed")
        }
    }).clone()

    // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdCreator}&text=${msg}&parse_mode=markdown`
    
    // https.get(target, (res) => {
    //     return console.log('Bulk Collection Update Telegram Notification sent')
    // })

    bot.telegram.sendMessage(user_chatIdCreator,msg,{
        parse_mode:'Markdown',
        reply_markup:{
            inline_keyboard:[
                [
                    {text:"Bulk Update Collections",url:mediaUrl}
                ]
            ]
        }
    })

    await ActivityData.updateMany({
        type: activity.type,
        block: activity.block
    }, {
        $set: {
            "isNotified": true,
        }
    }, async (error) => {
        if (error) {
            return console.log(error)
        }
    }).clone()
}


module.exports = {
    bulkAuction,
    bulkListingNft,
    bulkAuctionCancel,
    bulkAuctionRemoved,
    bulkDeListingNft,
    bulkBurnNft,
    bulkMinting,
    bulkTransfer,
    bulkTransferCollection,
    bulkUpdateCollection,
    bulkProcessBid,
    bulkPlaceBid,
    bulkBuyNft
}