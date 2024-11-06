const async = require('async');
const request = require('request');
const userDBO = require('../dbos/user.dbo');
const activityDBO = require('../dbos/activity.dbo');
const botHelper = require('./bot.helper');
const templateUtil = require('../utils/template.util');
const logger = require('../../logger');
const config = require('../../config');

String.prototype.fmt = function (hash) {
    var string = this, key; 
    for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); 
    return string;
};

const createDenomHelper = (activity) => {
    async.waterfall([
        (next) => {
            activityDBO.findOne({
                "_id": activity._id
            }, {}, {}, false, (error, activityData) => {
                if (error) {
                    next(error);
                } else if (activityData) {
                    next(null, activityData);
                } else {
                    next('Activity not found');
                }
            });
        }, (activityData, next) => {
            userDBO.find({
                "isSubscribe": true,
                "omniflixAddress": activityData.creator
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result && result.length) {
                    const owners = [];
                    result.forEach(owner => {
                        owners.push(owner.userId);
                    });
                    next(null, activityData, owners);
                } else {
                    logger.error('No subscribed owners found');
                    next(null, activityData, []);
                }
            });
        }, (activityData, owners, next) => {
            const symbol = templateUtil.escapeMarkdown(activityData.symbol);
            const name = templateUtil.escapeMarkdown(activityData.name);
            const msg = templateUtil.createDenomHelperMsg.message.fmt({ 
                SYMBOL: symbol, 
                NAME: name, 
                DENOMID: activityData.id 
            });
            const mediaUrl = templateUtil.createDenomHelperMsg.url.fmt({ 
                DENOMID: activityData.id 
            });

            const options = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: "Collection Has Been Created", url: mediaUrl }]]
                }
            };

            botHelper.sendMessages(owners, msg, options, (error) => {
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

const transferDenomHelper = (activity) => {
    async.waterfall([
        (next) => {
            activityDBO.findOne({
                "_id": activity._id
            }, {}, {}, false, (error, activityData) => {
                if (error) {
                    next(error);
                } else if (activityData) {
                    next(null, activityData);
                } else {
                    next('Activity not found');
                }
            });
        }, (activityData, next) => {
            const creators = [];
            userDBO.find({
                "isSubscribe": true,
                "omniflixAddress": activityData.creator
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result && result.length) {
                    result.forEach(creator => {
                        creators.push(creator.userId);
                    });
                    next(null, activityData, creators);
                } else {
                    logger.error('No subscribed creators found');
                    next(null, activityData, []);
                }
            });
        }, (activityData, creators, next) => {
            const recipients = [];
            userDBO.find({
                "isSubscribe": true,
                "omniflixAddress": activityData.recipient
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result && result.length) {
                    result.forEach(recipient => {
                        recipients.push(recipient.userId);
                    });
                    next(null, activityData, creators, recipients);
                } else {
                    logger.error('No subscribed recipients found');
                    next(null, activityData, creators, []);
                }
            });
        }, (activityData, creators, recipients, next) => {
            const mediaUrl = templateUtil.transferDenomHelperMsg.url.fmt({ 
                DENOMID: activityData.id 
            });

            const notifications = [];

            if (creators.length) {
                const creatorMsg = templateUtil.transferDenomHelperMsg.senderMsg.fmt({ 
                    DENOMID: activityData.id, 
                    ACTIVITYDATARECIPIENT: activityData.recipient 
                });
                const creatorOptions = {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[{ text: "Transferred Collection", url: mediaUrl }]]
                    }
                };
                notifications.push(
                    new Promise((resolve) => {
                        botHelper.sendMessages(creators, creatorMsg, creatorOptions, resolve);
                    })
                );
            }
            if (recipients.length) {
                const recipientMsg = templateUtil.transferDenomHelperMsg.receiverMsg.fmt({ 
                    DENOMID: activityData.id, 
                    ACTIVITYDATACREATOR: activityData.creator 
                });
                const recipientOptions = {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[{ text: "Received Collection", url: mediaUrl }]]
                    }
                };
                notifications.push(
                    new Promise((resolve) => {
                        botHelper.sendMessages(recipients, recipientMsg, recipientOptions, resolve);
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

const updateDenomHelper = (activity) => {
    async.waterfall([
        (next) => {
            activityDBO.findOne({
                "_id": activity._id
            }, {}, {}, false, (error, activityData) => {
                if (error) {
                    next(error);
                } else if (activityData) {
                    next(null, activityData);
                } else {
                    next('Activity not found');
                }
            });
        }, (activityData, next) => {
            userDBO.find({
                "isSubscribe": true,
                "omniflixAddress": activityData.creator
            }, {}, {}, false, (error, owners) => {
                if (error) {
                    next(error);
                } else if (owners && owners.length) {
                    const ownersData = [];
                    owners.forEach(owner => {
                        ownersData.push(owner.userId);
                    });
                    next(null, activityData, ownersData);
                } else {
                    logger.error('No subscribed owners found');
                    next(null, activityData, []);
                }
            });
        }, (activityData, owners, next) => {
            const symbol = templateUtil.escapeMarkdown(activityData.symbol);
            const name = templateUtil.escapeMarkdown(activityData.name);
            const msg = templateUtil.updateDenomHelperMsg.message.fmt({ 
                SYMBOL: symbol, 
                NAME: name, 
                DENOMID: activityData.id 
            });
            const mediaUrl = templateUtil.updateDenomHelperMsg.url.fmt({ 
                DENOMID: activityData.id 
            });

            const options = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: "Collection Has Been Updated", url: mediaUrl }]]
                }
            };

            botHelper.sendMessages(owners, msg, options, (error) => {
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

const verifyCollection = (denomId, cb) => {
    const url = `${config.omniflix.datalayerUrl}/collections/${denomId}`
    const options = { json: true };

    async.waterfall([
        (next) => {
            request(url, options, (error, res) => {
                console.log('res', res.statusCode);
                if (error) {
                    next(error);
                } else if (res && res.statusCode == 200) {
                    next(null, true);
                } else {
                    next(null, false);
                }
            });
        }
    ], (error, result) => {
        if (error) {
            logger.error(error);
            cb(error, false);
        } else {
            cb(null, result);
        }
    });
}

module.exports = {
    createDenomHelper,
    transferDenomHelper,
    updateDenomHelper,
    verifyCollection
};


