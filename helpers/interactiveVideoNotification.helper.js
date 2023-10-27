const { userData } = require('../models/user.model');
const { interactiveVideoData } = require("../models/interactive_video.model");
const { channelsData } = require("../models/channels.model");
const { NewIVPublishedHelperMsg, NewChannelsHelperMsg } = require("../src/template.js")
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.token);

String.prototype.fmt = function (hash) {
    var string = this, key; for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); return string
}

let newIVPublishedHelper = async (interactiveVideo) => {
    let messageType = 'Interactive Videos'
    let user_chatId = []
    await userData.find({
        "isSubscribe": true,
        notificationTypes: { $ne: messageType },
        $or: [
            { channels: [] },
            { channels: {$in: interactiveVideo.publish_settings.channels._id}},
        ]
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
    let msg = NewIVPublishedHelperMsg.message.fmt({ IV_ID: interactiveVideo._id, IV_NAME: interactiveVideo.title, CHANNEL_NAME: interactiveVideo.publish_settings.channels[0].name, CHANNEL_ID: interactiveVideo.publish_settings.channels[0]._id });
    let mediaUrl = NewIVPublishedHelperMsg.url.fmt({ IV_ID: interactiveVideo._id });
    user_chatId.forEach(async (chatid) => {
        try {
            bot.telegram.sendMessage(chatid, msg, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "New Interactive Video Published On TV", url: mediaUrl }
                        ]
                    ]
                }
            })
        } catch (e) {
            if (e.response && e.response.error_code === 403) {
                console.log('Bot was blocked by the user');
                await User.findOneAndDelete({
                    userId: chatid
                })
            } else {
                throw e;
            }
        }
    })

    interactiveVideoData.findOneAndUpdate({
        "_id": interactiveVideo._id
    }, {
        $set: {
            "isNotified": true,
        }
    }, async (error) => {
        if (error) {
            return console.log(error)
        }
    })
};

let newChannelsHelper = async (Channel) => {
    let messageType = 'Channels'
    let user_chatId = []
    await userData.find({
        "isSubscribe": true,
        notificationTypes: { $ne: messageType },
        $or: [
            {channels: undefined},
            { channels: [] },
            { channels: { $in: [Channel.username, Channel.name] } }
        ]
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

    let msg = NewChannelsHelperMsg.message.fmt({ CHANNEL_ID: Channel._id, CHANNEL_NAME: Channel.name });
    let mediaUrl = NewChannelsHelperMsg.url.fmt({ CHANNEL_ID: Channel._id });
    user_chatId.forEach(async (chatid) => {
        try {
            bot.telegram.sendMessage(chatid, msg, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "New Channel Created On TV", url: mediaUrl }
                        ]
                    ]
                }
            })
        } catch (e) {
            if (e.response && e.response.error_code === 403) {
                console.log('Bot was blocked by the user');
                await User.findOneAndDelete({
                    userId: chatid
                })
            } else {
                throw e;
            }
        }
    })

    channelsData.findOneAndUpdate({
        "_id": Channel._id
    }, {
        $set: {
            "isNotified": true,
        }
    }, async (error) => {
        if (error) {
            return console.log(error)
        }
    })
};

module.exports = {
    newIVPublishedHelper,
    newChannelsHelper,
}