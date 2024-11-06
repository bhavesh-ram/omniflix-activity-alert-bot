const async = require('async');
const activityDBO = require('../dbos/activity.dbo');
const userDBO = require('../dbos/user.dbo');
const botHelper = require('./bot.helper');
const templateUtil = require('../utils/template.util');
const logger = require('../../logger');

const saveWhitelistContractHelper = (activity) => {
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
                    next('No activity found!');
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
                    logger.error('No user found!');
                    next(null, activityResponse, null);
                }
            })
        }, (activityResponse, userId, next) => {
            const msg = templateUtil.saveWhitelistContractTemplate.message.fmt({
                CONTRACT_ADDRESS: activityResponse.contract_address
            });
            botHelper.sendMessages([userId], msg, {
                parse_mode: 'Markdown'
            }, (error) => {
                if (error) {
                    logger.error(error);
                }
                next(null, activityResponse);
            });
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
                    next('No activity found!');
                }
            });
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    });
}

module.exports = {
    saveWhitelistContractHelper
}