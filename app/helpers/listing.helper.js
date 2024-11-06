const async = require('async');
const userDBO = require('../dbos/user.dbo');
const activityDBO = require('../dbos/activity.dbo');
const botHelper = require('./bot.helper');
const templateUtil = require('../utils/template.util');
const logger = require('../../logger');

String.prototype.fmt = function (hash) {
    var string = this, key; 
    for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); 
    return string;
};

const listingHelper = (activity) => {
    const messageType = activity.type === 'MsgListNFT' ? 'NFT Listings' : null;
    const user_chatId = [];

    async.waterfall([
        (next) => {
            userDBO.find({
                "isSubscribe": true,
                notificationTypes: { $ne: messageType },
                $or: [
                    { collections: [] },
                    { collections: activity.denom_id.id }
                ]
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result && result.length) {
                    result.forEach(user => {
                        user_chatId.push(user.userId);
                    });
                    next(null, user_chatId);
                } else {
                    logger.error('No users subscribed');
                    next(null, []);
                }
            });
        }, (userIds, next) => {
            const parts = activity.nft_id.preview_uri ? 
                activity.nft_id.preview_uri.split('/') : 
                activity.nft_id.media_uri.split('/');

            const msg = templateUtil.listingHelperMsg.message.fmt({ 
                IPFS_HASH: parts[parts.length - 1],
                ACTIVITYNFT_IDID: activity.nft_id.id, 
                DENOMID: activity.denom_id.id, 
                COLLECTION_NAME: activity.denom_id.name
            });

            const mediaUrl = templateUtil.listingHelperMsg.activity_url.fmt({ 
                ACTIVITYNFT_IDID: activity.nft_id.id 
            });

            if (activity.nft_id.nsfw) {
                const previewUrl = 'https://f4.omniflix.market/assets/logos/og_image.png';
                const options = {
                    caption: msg,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[{ text: "Listed NFT", url: mediaUrl }]]
                    }
                };
                botHelper.sendPhotos(userIds, previewUrl, options, (error) => {
                    if (error) {
                        logger.error(error);
                    }
                    next(null);
                });
            } else {
                const options = {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[{ text: "Listed NFT", url: mediaUrl }]]
                    }
                };
                botHelper.sendMessages(userIds, msg, options, (error) => {
                    if (error) {
                        logger.error(error);
                    }
                    next(null);
                });
            }
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

const deListingHelper = (activity) => {
    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.owner
            }, {}, {}, false, (error, user) => {
                if (error) {
                    next(error);
                } else if (user) {
                    next(null, user.userId);
                } else {
                    logger.error('DeListing NFT user not subscribed');
                    next(null, null);
                }
            });
        }, (userId, next) => {
            const parts = activity.nft_id.preview_uri ? 
                activity.nft_id.preview_uri.split('/') : 
                activity.nft_id.media_uri.split('/');

            const msg = templateUtil.delistingHelperMsg.message.fmt({ 
                IPFS_HASH: parts[parts.length - 1],
                ACTIVITYNFT_IDID: activity.nft_id.id, 
                DENOMID: activity.denom_id.id, 
                COLLECTION_NAME: activity.denom_id.name
            });

            const mediaUrl = templateUtil.delistingHelperMsg.url.fmt({ 
                ACTIVITYNFT_IDID: activity.nft_id.id 
            });

            const options = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: "NFT Delisted from MarketPlace", url: mediaUrl }]]
                }
            };

            botHelper.sendMessages([userId], msg, options, (error) => {
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
    listingHelper,
    deListingHelper
};