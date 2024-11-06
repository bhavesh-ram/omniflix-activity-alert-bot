const async = require('async');
const interactiveVideoDBO = require('../dbos/interactive_video.dbo');
const userDBO = require('../dbos/user.dbo');
const botHelper = require('../helpers/bot.helper');
const templateUtil = require('../utils/template.util');

String.prototype.fmt = function (hash) {
    var string = this, key; for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); return string
}

const newIVPublishedHelper = (interactiveVideo, cb) => {
    const messageType = 'New Interactive Content';
    const user_chatId = [];
    
    async.waterfall([
        (next) => {
            userDBO.find({
                "isSubscribe": true,
                notificationTypes: { $ne: messageType },
                $or: [
                    { channels: [] },
                    { channels: { $in: interactiveVideo.publish_settings.channels._id } },
                ]
            }, (error, result) => {
                if (error) {
                    next(error);
                } else if (result && result.length) {
                    result.forEach(user => {
                        user_chatId.push(user.userId);
                    });
                    next(null);
                } else {
                    next('No User subscribed');
                }
            });
        }, (next) => {
            const msg = templateUtil.NewIVPublishedHelperMsg.message.fmt({ 
                IV_ID: interactiveVideo._id,
                IV_NAME: interactiveVideo.title,
                CHANNEL_NAME: interactiveVideo.publish_settings.channels[0].name,
                CHANNEL_ID: interactiveVideo.publish_settings.channels[0]._id
            });
            const mediaUrl = templateUtil.NewIVPublishedHelperMsg.url.fmt({ IV_ID: interactiveVideo._id });
            const options = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "New Interactive Video Published On TV", url: mediaUrl }
                        ]
                    ]
                }
            };
            next(null, msg, options);
        }, (msg, options, next) => {
            botHelper.sendMessages(user_chatId, msg, options, (error) => {
                if (error) {
                    next(error);
                } else {
                    next(null);
                }
            });
        }, (next) => {
            interactiveVideoDBO.findOneAndUpdate({
                _id: interactiveVideo._id,
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
                    next('Interactive video not found!');
                }
            })
        },
    ], cb);
};

const addInteractiveVideo = (interactiveVideo, cb) => {
    async.waterfall([
        (next) => {
            interactiveVideoDBO.save(interactiveVideo, false, (error) => {
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
}

module.exports = {
    newIVPublishedHelper,
    addInteractiveVideo,
}