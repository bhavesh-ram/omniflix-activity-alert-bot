const dotenv = require('dotenv').config()
const https = require('https')

const { userData } = require('../models/user.model');
const { ActivityData } = require("../models/activity.model");
const {transferNftHelperMsg} = require("../src/template.js")

String.prototype.fmt = function (hash) {
    var string = this, key; for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); return string
}


let transferNftHelper = async (activity) => {
    // console.log(activity)
    let user_chatIdSender
    let user_omniflixAddressSender
    let user_chatIdRecipient
    let user_omniflixAddressRecipient

    await userData.findOne({
        "isSubscribe": true,
        "omniflixAddress": activity.recipient
    },async(error, result) => {
        if (error) {
            return console.log(error)
        } else if (result) {
            user_chatIdRecipient =result.userId
            user_omniflixAddressRecipient =result.omniflixAddress
            
        } else {
            return console.log("Transfer Nft Recipient not subscribed")
        }
    }).clone()

    await userData.findOne({
        "isSubscribe": true,
        "omniflixAddress": activity.sender
    },async(error, result)=>{
        if (error) {
            return console.log(error)
        } else if (result) {
            user_chatIdSender =result.userId
            user_omniflixAddressSender=result.omniflixAddress
        } else {
            return console.log("Transfer Nft Owner Not subscribed")
        }
    }).clone()


    if(user_omniflixAddressSender !=undefined && user_chatIdSender != undefined){
        // let msg = ` ***You Transferred Nft.*** 
        // (https://omniflix.market/nft/${activity.id})`
        let msg = transferNftHelperMsg.senderMsg.fmt({ ACTIVITYID:activity.id})
        let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdSender}&text=${msg}&parse_mode=markdown`
        https.get(target, (res) => {
            return console.log('Transferred Nft Telegram Notification sent')
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

    if(user_chatIdRecipient != undefined && user_omniflixAddressRecipient != undefined){
        // let msg = ` ***You Receved New NFT In your Account*** 
        // (https://omniflix.market/nft/${activity.id})`
        let msg = transferNftHelperMsg.receiverMsg.fmt({ ACTIVITYID:activity.id})
        let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdRecipient}&text=${msg}&parse_mode=markdown`
        https.get(target, (res) => {
            return console.log('Nft Received Telegram Notification sent')
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


module.exports={
    transferNftHelper,
}