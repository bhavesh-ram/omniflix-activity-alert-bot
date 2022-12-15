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


        // console.log("transferDenomHelper");
        // let id = activity;
        let id = activity._id;
        let activityData = await ActivityData.findOne({ _id: id });
        if (!activityData) {
            console.log("Acitivity not found");
        }



        let creatorData = await userData.find({
            isSubscribe: true,
            omniflixAddress: activityData.creator

        })

        // owner is receipent in this context
        let ownerData = await userData.find({
            isSubscribe: true,
            omniflixAddress: activityData.recipient
        })

        let denomId = activityData.id;

        if (creatorData.length) {
            creatorData.forEach((data) => {
                // let msg = `You have transferred this collection to ${activityData.recipient} %0A(https://omniflix.market/collection/${denomId})`;
                let msg = transferDenomHelperMsg.senderMsg.fmt({ DENOMID:denomId,ACTIVITYDATARECIPIENT:activityData.recipient})
                let userId = data.userId;
                let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${userId}&text=${msg}&parse_mode=markdown`
                https.get(target, (res) => {
                    console.log("Notification sent");
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
                // let msg = `You have received the below collection from %0A${activityData.creator} %0A(https://omniflix.market/collection/${denomId})`;
                let msg = transferDenomHelperMsg.receiverMsg.fmt({ DENOMID:denomId,ACTIVITYDATACREATOR:activityData.creator})
                let userId = data.userId;
                let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${userId}&text=${msg}&parse_mode=markdown`
                https.get(target, (res) => {
                    console.log("Notification sent");
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
        // let id = activity;
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
        // let description = activityData.description;

        // console.log(ownerData)



        if (ownerData.length) {

            ownerData.forEach((data) => {



                // let ownerMsg = `Your collection has been updated  %0ASymbol: ${symbol} %0AName: ${name} %0AClick this link to check: (https://omniflix.market/collection/${denomId})`;
                let ownerMsg = updateDenomHelperMsg.fmt({SYMBOL:symbol,NAME:name, DENOMID:denomId})
                let ownerTarget = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${data.userId}&text=${ownerMsg}&parse_mode=markdown`

                https.get(ownerTarget, (res) => {
                    console.log("Notification sent")
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


