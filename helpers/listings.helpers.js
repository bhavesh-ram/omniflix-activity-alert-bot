const dotenv = require('dotenv').config()
const https = require('https')
// const date =require('date-and-time');


const { userData } = require('../models/user.model');
const { ActivityData } = require("../models/activity.model");
const {listingHelperMsg,delistingHelperMsg} = require("../src/template.js")
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.token);

String.prototype.fmt = function (hash) {
    var string = this, key; for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); return string
}

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
    // console.log(date.format(activity.created_at, 'ddd MMM YYYY at SS:SS [UTC]'))
        let msg = listingHelperMsg.message.fmt({ ACTIVITYNFT_IDID:activity.nft_id.id});
        let mediaUrl = listingHelperMsg.url.fmt({ ACTIVITYNFT_IDID:activity.nft_id.id});
    user_chatId.forEach((chatid) => {
        
        bot.telegram.sendMessage(chatid,msg,{parse_mode:'Markdown',
            reply_markup:{
                inline_keyboard:[
                    [
                        {text:"New Listing On MarketPlace",url:mediaUrl}
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
        
        let msg = delistingHelperMsg.message.fmt({ ACTIVITYNFT_IDID:activity.nft_id.id})
        let mediaUrl = delistingHelperMsg.url.fmt({ ACTIVITYNFT_IDID:activity.nft_id.id})

       

        bot.telegram.sendMessage(user_chatIdOwner,msg,{
            parse_mode:'Markdown',
            reply_markup:{
                inline_keyboard:[
                    [
                        {text:"NFT Delisted from MarketPlace",url:mediaUrl}
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


module.exports = {
    listingHelper,
    deListingHelper
}