const async = require('async');
const date = require('date-and-time');
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

const MsgCreateCampaignHelper = (activity) => {
    const messageType = activity.type === 'MsgCreateCampaignHelper' ? 'Campaign Creation' : null;

    async.waterfall([
        (next) => {
            userDBO.find({
                "isSubscribe": true,
                notificationTypes: { $ne: messageType },
                $or: [
                    { collections: [] },
                    { collections: activity.denom_id.id }
                ]
            }, {}, {}, false, (error, users) => {
                if (error) {
                    next(error);
                } else if (users && users.length) {
                    const userIds = users.map(user => user.userId);
                    next(null, userIds);
                } else {
                    logger.error('No users subscribed');
                    next(null, []);
                }
            });
        }, (userIds, next) => {
            const msg = templateUtil.createCampaignMsg.message.fmt({ 
                ACTIVITYNFT_IDID: activity.id, 
                START_DATE: date.format(activity.start_time, 'ddd MMM YYYY at SS:SS [UTC]'), 
                END_DATE: date.format(activity.end_time, 'ddd MMM YYYY at SS:SS [UTC]') 
            });
            const mediaUrl = templateUtil.createCampaignMsg.url.fmt({ 
                ACTIVITYNFT_IDID: activity.id 
            });

            const options = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: "New Campaign Created", url: mediaUrl }]]
                }
            };

            botHelper.sendMessages(userIds, msg, options, (error) => {
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
                    logger.error(error);
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

const MsgCancelCampaignHelper = (activity) => {
    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.creator
            }, {}, {}, false, (error, user) => {
                if (error) {
                    next(error);
                } else if (user) {
                    next(null, user.userId);
                } else {
                    logger.error('Cancel Campaign user not subscribed');
                    next(null, null);
                }
            });
        }, (userId, next) => {
            const msg = templateUtil.cancelCampaignMsg.message.fmt({ 
                ACTIVITYNFT_IDID: activity.id 
            });
            const mediaUrl = templateUtil.cancelCampaignMsg.url.fmt({ 
                ACTIVITYNFT_IDID: activity.id 
            });

            const options = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: "Campaign Cancelled", url: mediaUrl }]]
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

const MsgDepositCampaignHelper = (activity) => {
    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.creator
            }, {}, {}, false, (error, user) => {
                if (error) {
                    next(error);
                } else if (user) {
                    next(null, user.userId);
                } else {
                    logger.error('Deposit Campaign user not subscribed');
                    next(null, null);
                }
            });
        }, (user, next) => {
            const msg = templateUtil.depositCampaignMsg.message.fmt({ 
                ACTIVITYNFT_IDID: activity.id 
            });
            const mediaUrl = templateUtil.depositCampaignMsg.url.fmt({ 
                ACTIVITYNFT_IDID: activity.id 
            });

            const options = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: "Deposit Campaign", url: mediaUrl }]]
                }
            };

            botHelper.sendMessages([user], msg, options, (error) => {
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

const endCampaignHelper = (activity) => {
    const messageType = activity.type === 'EndCampaign' ? 'End Campaign' : null;

    async.waterfall([
        (next) => {
            userDBO.find({
                "isSubscribe": true,
                notificationTypes: { $ne: messageType },
                $or: [
                    { collections: [] },
                    { collections: activity.denom.id }
                ]
            }, {}, {}, false, (error, users) => {
                if (error) {
                    next(error);
                } else if (users && users.length) {
                    const userIds = users.map(user => user.userId);
                    next(null, userIds);
                } else {
                    logger.error('No users subscribed');
                    next(null, []);
                }
            });
        }, (userIds, next) => {
            const msg = templateUtil.endCampaignMsg.message.fmt({ 
                ACTIVITYNFT_IDID: activity.id 
            });
            const mediaUrl = templateUtil.endCampaignMsg.url.fmt({ 
                ACTIVITYNFT_IDID: activity.id 
            });

            const options = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: "Campaign Ended", url: mediaUrl }]]
                }
            };

            botHelper.sendMessages(userIds, msg, options, (error) => {
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

const MsgClaimCampaignHelper = (activity) => {
    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.claimer
            }, {}, {}, false, (error, user) => {
                if (error) {
                    next(error);
                } else if (user) {
                    next(null, user.userId);
                } else {
                    logger.error('Claim Campaign user not subscribed');
                    next(null, user);
                }
            });
        }, (user, next) => {
            const msg = templateUtil.claimCampaignMsg.message.fmt({ 
                ACTIVITYNFT_IDID: activity.id 
            });
            const mediaUrl = templateUtil.claimCampaignMsg.url.fmt({ 
                ACTIVITYNFT_IDID: activity.id 
            });

            const options = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: "Claimed from Campaign", url: mediaUrl }]]
                }
            };

            if (activity && activity.nft && activity.nft.nsfw) {
                const previewUrl = 'https://f4.omniflix.market/assets/logos/og_image.png';
                options.caption = msg;
                botHelper.sendPhotos([user], previewUrl, options, (error) => {
                    if (error) {
                        logger.error(error)
                    }
                    next(null);
                });
            } else {
                botHelper.sendMessages([user], msg, options, (error) => {
                    if (error) {
                        logger.error(error)
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

const campaignTransferNFTHelper = (activity) => {
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
                    logger.error('Campaign Transfer Nft Recipient not subscribed');
                    next(null, null)
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
                    logger.error('Campaign Transfer Nft Owner Not subscribed');
                    next(null, recipient, null);
                }
            });
        }, (recipient, sender, next) => {
            const mediaUrl = templateUtil.campaignTransferNftHelperMsg.url.fmt({ 
                ACTIVITYID: activity.id 
            });

            const senderMsg = templateUtil.campaignTransferNftHelperMsg.senderMsg.fmt({ 
                ACTIVITYID: activity.id 
            });
            const receiverMsg = templateUtil.campaignTransferNftHelperMsg.receiverMsg.fmt({ 
                ACTIVITYID: activity.id 
            });

            const notifications = [];

            const senderOptions = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: "NFT Transferred", url: mediaUrl }]]
                }
            };

            if (activity.nsfw) {
                const previewUrl = 'https://f4.omniflix.market/assets/logos/og_image.png';
                senderOptions.caption = senderMsg;
                notifications.push(
                    new Promise((resolve) => {
                        botHelper.sendPhotos([sender], previewUrl, senderOptions, resolve);
                    })
                );
            } else {
                notifications.push(
                    new Promise((resolve) => {
                        botHelper.sendMessages([sender], senderMsg, senderOptions, resolve);
                    })
                );
            }

            const receiverOptions = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: "NFT Received", url: mediaUrl }]]
                }
            };

            notifications.push(
                new Promise((resolve) => {
                    botHelper.sendMessages([recipient], receiverMsg, receiverOptions, resolve);
                })
            );

            Promise.all(notifications)
                .then(() => next(null))
                .catch(error => {
                    logger.error(error);
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

const MsgStreamSendHelper = (activity) => {
    async.waterfall([
        (next) => {
            async.parallel({
                recipient: (callback) => {
                    userDBO.findOne({
                        "isSubscribe": true,
                        "omniflixAddress": activity.recipient
                    }, {}, {}, false, (error, user) => {
                        if (error) {
                            callback(error);
                        } else if (user) {
                            callback(null, user.userId);
                        } else {
                            logger.error('Recipient not subscribed');
                            callback(null, null);
                        }
                    });
                },
                sender: (callback) => {
                    userDBO.findOne({
                        "isSubscribe": true,
                        "omniflixAddress": activity.sender
                    }, {}, {}, false, (error, user) => {
                        if (error) {
                            callback(error);
                        } else if (user) {
                            callback(null, user.userId);
                        } else {
                            logger.error('Sender not subscribed');
                            callback(null, null);
                        }
                    });
                }
            }, (error, results) => {
                if (error) {
                    next(error);
                } else {
                    next(null, results);
                }
            });
        }, ({recipient, sender}, next) => {
            const mediaUrl = templateUtil.streamSendHelperMsg.url.fmt({ 
                ACTIVITYID: activity.id 
            });

            const notifications = [];

            if (sender) {
                const senderMsg = templateUtil.streamSendHelperMsg.senderMsg.fmt({ 
                    ACTIVITYID: activity.id 
                });
                const senderOptions = {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[{ text: "Stream Send", url: mediaUrl }]]
                    }
                };
                notifications.push(
                    new Promise((resolve) => {
                        botHelper.sendMessages([sender], senderMsg, senderOptions, resolve);
                    })
                );
            }

            if (recipient) {
                const receiverMsg = templateUtil.streamSendHelperMsg.receiverMsg.fmt({ 
                    ACTIVITYID: activity.id 
                });
                const receiverOptions = {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[{ text: "Stream Received", url: mediaUrl }]]
                    }
                };
                notifications.push(
                    new Promise((resolve) => {
                        botHelper.sendMessages([recipient], receiverMsg, receiverOptions, resolve);
                    })
                );
            }

            Promise.all(notifications)
                .then(() => next(null))
                .catch(error => {
                    logger.error(error);
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

const MsgStreamCreatedHelper = (activity) => {
        return MsgStreamSendHelper(activity);
};

const MsgStopStreamHelper = (activity) => {
    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.sender
            }, {}, {}, false, (error, user) => {
                if (error) {
                    next(error);
                } else if (user) {
                    next(null, user.userId);
                } else {
                    logger.error('Stop Stream user not subscribed');
                    next(null, null);
                }
            });
        }, (user, next) => {
            const msg = templateUtil.StopStreamMsg.message.fmt({ 
                ACTIVITYNFT_IDID: activity.id 
            });
            const mediaUrl = templateUtil.StopStreamMsg.url.fmt({ 
                ACTIVITYNFT_IDID: activity.id 
            });

            const options = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: "Stream Stopped!", url: mediaUrl }]]
                }
            };

            botHelper.sendMessages([user], msg, options, (error) => {
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

const MsgClaimStreamedAmountHelper = (activity) => {
    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.claimer
            }, {}, {}, false, (error, user) => {
                if (error) {
                    next(error);
                } else if (user) {
                    next(null, user.userId);
                } else {
                    logger.error('Claim Stream user not subscribed');
                    next(null, null);
                }
            });
        }, (user, next) => {
            const msg = templateUtil.claimStreamedAmountMsg.message.fmt({ 
                ACTIVITYNFT_IDID: activity.id,
                AMOUNT: (activity.amount.amount / 1000000)
            });
            const mediaUrl = templateUtil.claimStreamedAmountMsg.url.fmt({ 
                ACTIVITYNFT_IDID: activity.id 
            });

            const options = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: "Claimed Amount From Stream", url: mediaUrl }]]
                }
            };

            botHelper.sendMessages([user], msg, options, (error) => {
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
    MsgCreateCampaignHelper,
    MsgCancelCampaignHelper,
    MsgDepositCampaignHelper,
    endCampaignHelper,
    MsgClaimCampaignHelper,
    campaignTransferNFTHelper,
    MsgStreamSendHelper,
    MsgStopStreamHelper,
    MsgClaimStreamedAmountHelper,
    MsgStreamCreatedHelper
};