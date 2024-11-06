const async = require('async');
const userDBO = require('../dbos/user.dbo');
const channelDBO = require('../dbos/channel.dbo');
const botHelper = require('../helpers/bot.helper');
const templateUtil = require('../utils/template.util');

const addChannel = (channel, cb) => {
    async.waterfall([
        (next) => {
            channelDBO.save(channel, false, (error) => {
                if (error) {
                    next(error);
                } else {
                    next(null);
                }
            });
        },
    ], (error) => {
        if (error) {
            cb(error);
        } else {
            cb(null);
        }
    });
};

const newChannelsHelper = async (channel) => {
    const messageType = 'New Channels'
    const user_chatId = []

    async.waterfall([
        (next) => {
            userDBO.find({
                "isSubscribe": true,
                notificationTypes: { $ne: messageType },
                $or: [
                    {channels: undefined},
                    { channels: [] },
                    { channels: { $in: [Channel.username, Channel.name] } }
                ]
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result && result.length) {
                    result.forEach((user) => {
                        user_chatId.push(user.userId);
                    })
                    next(null);
                } else {
                    next('No Users Subscribed!');
                }
            })
        }, (next) => {
            const msg = templateUtil.NewChannelsHelperMsg.message.fmt({
                CHANNEL_ID: channel._id,
                CHANNEL_NAME: channel.name
            });
            const mediaUrl = templateUtil.NewChannelsHelperMsg.fmt({
                CHANNEL_ID: channel._id,
            })
            const options = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "New Channel Created On TV", url: mediaUrl }
                        ]
                    ]
                }
            }
            next(null, msg, options);
        }, (msg, options, next) => {
            botHelper.sendMessages(user_chatId, msg, options, (error) => {
                if (error) {
                    next(error);
                } else {
                    next(null);
                }
            })
        }, (next) => {
            channelDBO.findOneAndUpdate({
                _id: channel._id,
            }, {
                $set: {
                    "isNotified": true,
                }
            }, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null);
                } else {
                    next('No Channel Found!');
                }
            })
        }
    ], cb);
};

module.exports = {
    addChannel,
    newChannelsHelper,
};