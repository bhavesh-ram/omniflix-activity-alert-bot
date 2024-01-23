const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.token);
const date = require('date-and-time');
const { userData } = require('../models/user.model');
const { tipData } = require("../models/tip.model");
const { ReceivedTipOnChannelMsg, ReceivedTipOnIVMsg  } = require('../src/template');
String.prototype.fmt = function (hash) {
    var string = this, key; for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); return string
}

let MsgTipReceivedOnHelper = async (tip) => {
    let user_chatIdOwner
    let user_omniflixAddressOwner

    await userData.findOne({
        "isSubscribe": true,
        "omniflixAddress": tip.creator
    }, async (error, result) => {
        if (error) {
            return console.log(error)
        } else if (result) {
            user_chatIdOwner = result.userId
            user_omniflixAddressOwner = result.omniflixAddress

        } else {
            return console.log("creator who received tip not subscribed")
        }
    }).clone()


    if (user_omniflixAddressOwner != undefined && user_chatIdOwner != undefined && !tip.interactive_video) {

        let msg = ReceivedTipOnChannelMsg.message.fmt({ AMOUNT: (tip.amount.amout/1000000), CHANNEL_USERANME: tip.channel_username  })

        try {
            bot.telegram.sendMessage(user_chatIdOwner, msg, {
                parse_mode: 'Markdown',
            })
        } catch (e) {
            if (e.response && e.response.error_code === 403) {
                console.log('Bot was blocked by the user');
                await User.findOneAndUpdate({
                    userId: user_chatIdOwner
                }, {
                    $set: { isSubscribe: false }
                })
            } else {
                throw e;
            }
        }

        tipData.findOneAndUpdate({
            "_id": tip._id
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
    if (user_omniflixAddressOwner != undefined && user_chatIdOwner != undefined && tip.interactive_video._id) {

        let msg = ReceivedTipOnIVMsg.message.fmt({ AMOUNT: (tip.amount.amout/1000000), IV_NAME: tip.interactive_video.title, IV_ID: tip.interactive_video._id })
        let mediaUrl = ReceivedTipOnIVMsg.url.fmt({ IV_ID: tip.interactive_video._id })
        try {
            bot.telegram.sendMessage(user_chatIdOwner, msg, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "Tip Received On Video", url: mediaUrl }
                        ]
                    ]
                }
            })
        } catch (e) {
            if (e.response && e.response.error_code === 403) {
                console.log('Bot was blocked by the user');
                await User.findOneAndUpdate({
                    userId: user_chatIdOwner
                }, {
                    $set: { isSubscribe: false }
                })
            } else {
                throw e;
            }
        }

        tipData.findOneAndUpdate({
            "_id": tip._id
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

    tipData.findOneAndUpdate({
        _id: tip._id
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

module.exports = {
    MsgTipReceivedOnHelper,
};
