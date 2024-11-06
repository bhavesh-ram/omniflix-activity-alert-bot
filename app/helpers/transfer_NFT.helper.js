const async = require('async');
const userDBO = require('../dbos/user.dbo');
const activityDBO = require('../dbos/activity.dbo');
const botHelper = require('../helpers/bot.helper');
const templateUtil = require('../utils/template.util');
const logger = require('../../logger');

String.prototype.fmt = function (hash) {
    var string = this, key; 
    for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); 
    return string;
};

const transferNFTHelper = (activity) => {
    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.recipient
            }, {}, {}, false, (error, recipient) => {
                if (error) {
                    next(error);
                } else if (recipient) {
                    next(null, recipient.userId);
                } else {
                    logger.error('Transfer Nft Recipient not subscribed');
                    next(null, null);
                }
            });
        }, (recipient, next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.sender
            }, {}, {}, false, (error, sender) => {
                if (error) {
                    next(error);
                } else if (sender) {
                    next(null, recipient, sender.userId);
                } else {
                    logger.error('Transfer Nft Owner Not subscribed');
                    next(null, recipient, null);
                }
            });
        }, (recipient, sender, next) => {
            const parts = activity.preview_uri ? 
                activity.preview_uri.split('/') : 
                activity.media_uri.split('/');

            const senderMsg = templateUtil.transferNftHelperMsg.senderMsg.fmt({ 
                IPFS_HASH: parts[parts.length - 1],
                ACTIVITYID: activity.id, 
                DENOMID: activity.denom_id.id, 
                COLLECTION_NAME: activity.denom_id.name 
            });

            const receiverMsg = templateUtil.transferNftHelperMsg.receiverMsg.fmt({ 
                ACTIVITYID: activity.id, 
                IPFS_HASH: parts[parts.length - 1]
            });

            const mediaUrl = templateUtil.transferNftHelperMsg.url.fmt({ 
                ACTIVITYID: activity.id 
            });

            const senderOptions = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: "NFT Transferred", url: mediaUrl }]]
                }
            };

            const receiverOptions = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: "NFT Received", url: mediaUrl }]]
                }
            };

            async.parallel([
                (callback) => {
                    botHelper.sendMessages([sender], senderMsg, senderOptions, callback);
                }, (callback) => {
                    botHelper.sendMessages([recipient], receiverMsg, receiverOptions, callback);
                }
            ], (error) => {
                if (error) {
                    logger.error(error);
                }
                next(null);
            });
        }, (next) => {
            activityDBO.findOneAndUpdate({
                "_id": activity._id
            }, {
                $set: { "isNotified": true }
            }, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null);
                } else {
                    next('Activity not found');
                }
            });
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    });
};

module.exports = {
    transferNFTHelper
};
