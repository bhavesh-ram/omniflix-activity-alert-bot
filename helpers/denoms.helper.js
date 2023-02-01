const https = require('https')
const { ActivityData } = require("../models/activity.model");
const { userData } = require('../models/user.model');
const dotenv = require('dotenv').config()
const {transferDenomHelperMsg,updateDenomHelperMsg} = require("../src/template.js")

String.prototype.fmt = function (hash) {
    var string = this, key; for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); return string
}


let transferDenomHelper = async (activity) => {
    try {

        let id = activity._id;
        let activityData = await ActivityData.findOne({ _id: id });
        if (!activityData) {
            console.log("Acitivity not found");
        }

        let creatorData = await userData.find({
            isSubscribe: true,
            omniflixAddress: activityData.creator

        })

        let ownerData = await userData.find({
            isSubscribe: true,
            omniflixAddress: activityData.recipient
        })

        let denomId = activityData.id;

        if (creatorData.length) {
            creatorData.forEach((data) => {
                let msg = transferDenomHelperMsg.senderMsg.fmt({ DENOMID:denomId,ACTIVITYDATARECIPIENT:activityData.recipient})
                let mediaUrl = transferDenomHelperMsg.url.fmt({ DENOMID:denomId})
                let userId = data.userId;

                bot.telegram.sendMessage(userId,msg,{
                    parse_mode:'Markdown',
                    reply_markup:{
                        inline_keyboard:[
                            [
                                {text:"Transferred Collection",url:mediaUrl}
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


        if (ownerData.length) {
            ownerData.forEach((data) => {
                let msg = transferDenomHelperMsg.receiverMsg.fmt({ DENOMID:denomId,ACTIVITYDATACREATOR:activityData.creator})
                let mediaUrl = transferDenomHelperMsg.url.fmt({ DENOMID:denomId})
                let userId = data.userId;

                bot.telegram.sendMessage(userId,msg,{
                    parse_mode:'Markdown',
                    reply_markup:{
                        inline_keyboard:[
                            [
                                {text:"Received Collection",url:mediaUrl}
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



       

        console.log("all working")

    } catch (error) {
        console.log(error);
    }
}

let updateDenomHelper = async (activity) => {
    try {
        console.log("updateDenomHelper working ")
        let id = activity._id;

        let activityData = await ActivityData.findOne({ _id: id });
        if (!activityData) {
            console.log("Acitivity not found");
        }

        let denomId = activityData.id;

        let ownerData = await userData.find({
            isSubscribe: true,
            omniflixAddress: activityData.creator
        })

        let symbol = activityData.symbol;
        let name = activityData.name;
    
        if (ownerData.length) {

            ownerData.forEach((data) => {

                let ownerMsg = updateDenomHelperMsg.message.fmt({SYMBOL:symbol,NAME:name, DENOMID:denomId})
                let mediaUrl = updateDenomHelperMsg.url.fmt({DENOMID:denomId})

                bot.telegram.sendMessage(data.userId,ownerMsg,{
                    parse_mode:'Markdown',
                    reply_markup:{
                        inline_keyboard:[
                            [
                                {text:"Collection Has Been Updated",url:mediaUrl}
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

     

    } catch (error) {
        console.log(error);
    }
}

module.exports = { transferDenomHelper, updateDenomHelper }


