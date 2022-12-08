const dotenv = require('dotenv').config()
const https = require('https')

const { userData } = require('../models/user.model');
const { ActivityData } = require("../models/activity.model");

let listingHelper = async (activity) => {
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
    console.log(user_chatId)
    let msg = ` ***New Listing On MarketPlace.***
        **Click the below Link**
        (https://omniflix.market/nft/${activity.nft_id.id})`
    user_chatId.forEach((chatid) => {
        let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${chatid}&text=${msg}&parse_mode=markdown`
        console.log("target", target)
        https.get(target, (res) => {
            return console.log('New Listing Telegram Notification sent')
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

let deListingHelper = async (activity) => {
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
        let msg = ` *** You Delisting Following Nft From MarketPlace.***
        (https://omniflix.market/nft/${activity.nft_id.id})`

        let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdOwner}&text=${msg}&parse_mode=markdown`
        console.log("target", target)
        https.get(target, (res) => {
            return console.log('Delisting NFT Telegram Notification sent')
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


module.exports = {
    listingHelper,
    deListingHelper
}