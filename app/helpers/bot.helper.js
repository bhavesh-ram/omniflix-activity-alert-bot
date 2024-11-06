const async = require('async');
const bot = require('../bot');
const userDBO = require('../dbos/user.dbo');
const logger = require('../../logger');

const sendMessages = (chatIds, msg, options, cb) => {
    async.waterfall([
        (next) => {
            async.forEachLimit(chatIds, 1, (chatId, callback) => {
                bot.telegram.sendMessage(chatId, msg, options)
                    .then(() => {
                        callback(null);
                    })
                    .catch((err) => {
                        if (err && err.response && err.response.error_code === 403) {
                            logger.error('Bot was blocked by the user!');
                            userDBO.findOneAndUpdate({
                                userId: chatId
                            }, {
                                $set: {
                                    isSubscribe: false
                                }
                            }, {}, false, (error) => {
                                if (error) {
                                    logger.error(error);
                                }
                            })
                        } else {
                            callback(err);
                        }
                    }
                )
            }, (error) => {
                if (error) {
                    next(error)
                } else {
                    next(null);
                }
            })
        }
    ], cb);
};

const sendPhotos = (chatIds, msg, options, cb) => {
    async.waterfall([
        (next) => {
            async.forEachLimit(chatIds, 1, (chatId, callback) => {
                bot.telegram.sendPhoto(chatId, msg, options)
                    .then(() => {
                        callback(null);
                    })
                    .catch((err) => {
                        if (err && err.response && err.response.error_code === 403) {
                            logger.error('Bot was blocked by the user!');
                            userDBO.findOneAndUpdate({
                                userId: chatId
                            }, {
                                $set: {
                                    isSubscribe: false
                                }
                            }, {}, false, (error) => {
                                if (error) {
                                    logger.error(error);
                                }
                            })
                        } else {
                            callback(err);
                        }
                    }
                )
            }, (error) => {
                if (error) {
                    next(error)
                } else {
                    next(null);
                }
            })
        }
    ], cb);
};

module.exports = {
    sendMessages,
    sendPhotos,
}