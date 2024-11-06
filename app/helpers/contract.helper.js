const async = require('async');
const activityDBO = require('../dbos/activity.dbo');
const userDBO = require('../dbos/user.dbo');
const botHelper = require('./bot.helper');
const templateUtil = require('../utils/template.util');
const logger = require('../../logger');

String.prototype.fmt = function (hash) {
    var string = this, key; for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); return string
}

const storeCodeHelper = (activity) => {
    async.waterfall([
        (next) => {
            activityDBO.findOneAndUpdate({
                _id: activity._id
            }, {
                $set: {
                    isNotified: true
                }
            }, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null);
                } else {
                    next('Failed to update activity!');
                }
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    })
}

const instantiateContractHelper = (activity) => {
    async.waterfall([
        (next) => {
            activityDBO.findOne({
                _id: activity._id
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, result);
                } else {
                    next('Failed to update activity!');
                }
            })
        }, (activityResponse, next) => {
            userDBO.findOne({
                isSubscribe: true,
                omniflixAddress: activityResponse.sender,
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, activityResponse, result.userId);
                } else {
                    logger.error('No user found');
                    next(null, activityResponse, null);
                }
            })
        }, (activityResponse, userId, next) => {
            const msg = templateUtil.instantiateContractTemplate.message.fmt({
                CONTRACT_ADDRESS: activityResponse.contract_address
            })
            botHelper.sendMessages([userId], msg, {
                parse_mode: 'Markdown'
            }, (error) => {
                if (error) {
                    logger.error(error);
                } 
                next(null, activityResponse);
            })
        }, (activityResponse, next) => {
            activityDBO.findOneAndUpdate({
                _id: activityResponse._id
            }, {
                $set: {
                    isNotified: true
                }
            }, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null);
                } else {
                    next('No Activity Found!');
                }
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    })
}

const executeContractUpdateDenomHelper = (activity) => {
    async.waterfall([
        (next) => {
            activityDBO.findOne({
                _id: activity._id
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, result);
                } else {
                    next('No Activity Found!');
                }
            })
        }, (activityResponse, next) => {
            if (activityResponse.minter_contract && activityResponse.minter_contract.sender) {
                userDBO.findOne({
                    isSubscribe: true,
                    omniflixAddress: activityResponse.minter_contract.sender
                }, {}, {}, false, (error, result) => {
                    if (error) {
                        next(error);
                    } else if (result) {
                        next(null, activityResponse, result.userId);
                    } else {
                        logger.error('No user found');
                        next(null, activityResponse, null);
                    }
                })
            } else {
                next(null, activityResponse, null);
            }
        }, (activityResponse, userId, next) => {
            const msg = templateUtil.executeContractUpdateDenomMsg.message.fmt({
                DENOMID: activityResponse.id
            })
            const url = templateUtil.executeContractUpdateDenomMsg.url.fmt({
                denom: activityResponse.id
            })
            botHelper.sendMessages([userId], msg, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'View on Omniflix Market', url: url }]
                    ]
                }
            }, (error) => {
                if (error) {
                    logger.error(error);
                } 
                next(null, activityResponse);
            })
        }, (activityResponse, next) => {
            activityDBO.findOneAndUpdate({
                _id: activityResponse._id
            }, {
                $set: {
                    isNotified: true
                }
            }, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null);
                } else {
                    next('No Activity Found!');
                }
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    })
}

const executeContractCreateDenomHelper = (activity) => {
    async.waterfall([
        (next) => {
            activityDBO.findOneAndUpdate({
                _id: activity._id
            }, {
                $set: {
                    isNotified: true
                }
            }, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, result);
                } else {
                    next('No Activity Found!');
                }
            })
        },
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    })
}

const executeContractPurgeDenomHelper = (activity) => {
    async.waterfall([
        (next) => {
            activityDBO.findOneAndUpdate({
                _id: activity._id
            }, {
                $set: {
                    isNotified: true
                }
            }, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null);
                } else {
                    next('No Activity Found!');
                }
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    })
}

const IBCInCreateDenomHelper = (activity) => {
    async.waterfall([
        (next) => {
            activityDBO.findOne({
                _id: activity._id
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, result);
                } else {
                    next('No Activity Found!');
                }
            })
        }, (activityResponse, next) => {
            userDBO.findOne({
                omniflixAddress: activityResponse.sender
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, activityResponse, result.userId);
                } else {
                    logger.error('No user found');
                    next(null, activityResponse, null);
                }
            })
        }, (activityResponse, userId, next) => {
            const msg = templateUtil.IBCInCreateDenomMsg.message.fmt({
                DENOMID: activityResponse.id
            })
            botHelper.sendMessages([userId], msg, {
                parse_mode: 'Markdown'
            }, (error) => {
                if (error) {
                    logger.error(error);
                } 
                next(null, activityResponse);
            })
        }, (activityResponse, next) => {
            activityDBO.findOneAndUpdate({
                _id: activityResponse._id
            }, {
                $set: {
                    isNotified: true
                }
            }, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null);
                } else {
                    next('No Activity Found!');
                }
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    })
}

const IBCInTransferNFTHelper = (activity) => {
    async.waterfall([
        (next) => {
            activityDBO.findOne({
                _id: activity._id
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, result);
                } else {
                    next('No Activity Found!');
                }
            })
        }, (activityResponse, next) => {
            userDBO.findOne({
                omniflixAddress: activityResponse.sender
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, activityResponse, result.userId);
                } else {
                    logger.error('No sender found');
                    next(null, activityResponse, null);
                }
            })
        }, (activityResponse, senderResponse, next) => {
            userDBO.findOne({
                omniflixAddress: activityResponse.recipient
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, activityResponse, senderResponse, result.userId);
                } else {
                    logger.error('No recipient found');
                    next(null, activityResponse, senderResponse, null);
                }
            })
        }, (activityResponse, senderResponse, recipientResponse, next) => {
            const senderMsg = templateUtil.IBCInTransferNFTMsg.sender.fmt({
                id: activityResponse.id
            })
            const recipientMsg = templateUtil.IBCInTransferNFTMsg.recipient.fmt({
                id: activityResponse.id
            })
            const url = templateUtil.IBCInTransferNFTMsg.url.fmt({
                id: activityResponse.id
            })
            const options = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'View on Omniflix Market', url: url }]
                    ]
                }
            }
            async.parallel([
                (callback) => {
                    botHelper.sendMessages([senderResponse], senderMsg, options, callback);
                }, (callback) => {
                    botHelper.sendMessages([recipientResponse], recipientMsg, options, callback);
                }
            ], (error) => {
                if (error) {
                    logger.error(error);
                }
                next(null, activityResponse);
            })
        }, (activityResponse, next) => {
            activityDBO.findOneAndUpdate({
                _id: activityResponse._id
            }, {
                $set: { isNotified: true }
            }, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null);
                } else {
                    next('No Activity Found!');
                }
            });
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    })
}

module.exports = {
    storeCodeHelper,
    instantiateContractHelper,
    executeContractUpdateDenomHelper,
    executeContractCreateDenomHelper,
    executeContractPurgeDenomHelper,
    IBCInCreateDenomHelper,
    IBCInTransferNFTHelper,
}
