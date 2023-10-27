const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.token);
const { ActivityData } = require("../models/activity.model");
const { userData } = require('../models/user.model');
const { transferDenomHelperMsg, updateDenomHelperMsg, createDenomHelperMsg } = require("../src/template.js")

String.prototype.fmt = function (hash) {
    var string = this, key; for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); return string
}


let createDenomHelper = async (activity) => {
    try {

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

            ownerData.forEach(async (data) => {

                let ownerMsg = createDenomHelperMsg.message.fmt({ SYMBOL: symbol, NAME: name, DENOMID: denomId })
                let mediaUrl = createDenomHelperMsg.url.fmt({ DENOMID: denomId })
                try {
                    bot.telegram.sendMessage(data.userId, ownerMsg, {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: "Collection Has Been Created", url: mediaUrl }
                                ]
                            ]
                        }
                    })
                } catch (e) {
                    if (e.response && e.response.error_code === 403) {
                        console.log('Bot was blocked by the user');
                        await User.findOneAndUpdate({
                            userId: data.userId
                        }, {
                            $set: { isSubscribe: false }
                        })
                    } else {
                        throw e;
                    }
                }
            })
        }
        await ActivityData.findOneAndUpdate({
            _id: id
        }, {
            $set: {
                isNotified: true
            }
        })



    } catch (error) {
        console.log(error);
    }
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
            creatorData.forEach(async (data) => {
                let msg = transferDenomHelperMsg.senderMsg.fmt({ DENOMID: denomId, ACTIVITYDATARECIPIENT: activityData.recipient })
                let mediaUrl = transferDenomHelperMsg.url.fmt({ DENOMID: denomId })
                let userId = data.userId;
                try {
                    bot.telegram.sendMessage(userId, msg, {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: "Transferred Collection", url: mediaUrl }
                                ]
                            ]
                        }
                    })
                } catch (e) {
                    if (e.response && e.response.error_code === 403) {
                        console.log('Bot was blocked by the user');
                        await User.findOneAndUpdate({
                            userId: userId
                        }, {
                            $set: { isSubscribe: false }
                        })
                    } else {
                        throw e;
                    }
                }
            })           

        }
    


        if (ownerData.length) {
            ownerData.forEach(async (data) => {
                let msg = transferDenomHelperMsg.receiverMsg.fmt({ DENOMID: denomId, ACTIVITYDATACREATOR: activityData.creator })
                let mediaUrl = transferDenomHelperMsg.url.fmt({ DENOMID: denomId })
                let userId = data.userId;
                try {
                    bot.telegram.sendMessage(userId, msg, {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: "Received Collection", url: mediaUrl }
                                ]
                            ]
                        }
                    })
                } catch (e) {
                    if (e.response && e.response.error_code === 403) {
                        console.log('Bot was blocked by the user');
                        await User.findOneAndUpdate({
                            userId: userId
                        }, {
                            $set: { isSubscribe: false }
                        })
                    } else {
                        throw e;
                    }
                }

            })

        }

        await ActivityData.findOneAndUpdate({
            _id: id
        }, {
            $set: {
                isNotified: true
            }
        })

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

            ownerData.forEach(async (data) => {

                let ownerMsg = updateDenomHelperMsg.message.fmt({ SYMBOL: symbol, NAME: name, DENOMID: denomId })
                let mediaUrl = updateDenomHelperMsg.url.fmt({ DENOMID: denomId })
                try {
                    bot.telegram.sendMessage(data.userId, ownerMsg, {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: "Collection Has Been Updated", url: mediaUrl }
                                ]
                            ]
                        }
                    })
                } catch (e) {
                    if (e.response && e.response.error_code === 403) {
                        console.log('Bot was blocked by the user');
                        await User.findOneAndUpdate({
                            userId: data.userId
                        }, {
                            $set: { isSubscribe: false }
                        })
                    } else {
                        throw e;
                    }
                }
            })
        }
        await ActivityData.findOneAndUpdate({
            _id: id
        }, {
            $set: {
                isNotified: true
            }
        })



    } catch (error) {
        console.log(error);
    }
}

module.exports = { transferDenomHelper, updateDenomHelper, createDenomHelper }


