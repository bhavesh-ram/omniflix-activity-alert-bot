const async = require("async")
const { Markup } = require('telegraf');
const userDBO = require("../dbos/user.dbo")
const logger = require('../../logger');

const notificationNotIntrestedIn = (ctx) => {
    const userId = ctx.update.message.from.id

    async.waterfall([
        (next) => {
            userDBO.findOne({
                userId: userId,
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null, result)
                } else {
                    ctx.reply('User not found.').catch((error) => {
                        logger.error(error)
                    })
                }
            })
        }, (user, next) => {
            if (!user.notificationTypes) {
                user.notificationTypes = []
            }

            const notificationTypes = [
                'New Auction Creation',
                'NFT Listings',
                'Multiple NFT Listings',
                'Multiple Auctions Creation',
                'Campaign Creation',
                'End Campaign',
                'New Interactive Content',
                'New Channels'
            ];

            const keyboard = notificationTypes.map((type) => {
                const isChecked = user.notificationTypes.includes(type);
                return [Markup.button.callback(type, `toggle_${type}`, isChecked)];
            });
    
            const replyMarkup = Markup.inlineKeyboard(keyboard);
            next(null, replyMarkup);
        }, (replyMarkup, next) => {
            ctx.reply('Select which notifications you’d like to turn back on', replyMarkup).catch((error) => {
                logger.error(error)
            });
        }
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    })
}


const toggleHandler = (ctx) => {
    const userId = ctx.from.id;
    const callbackData = ctx.callbackQuery.data;
    let notificationType;

    async.waterfall([
        (next) => {
            userDBO.findOne({
                userId: userId,
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null, result)
                } else {
                    ctx.reply('User not found.').catch((error) => {
                        logger.error(error)
                    })
                }
            })
        }, (user, next) => {
            if (/^toggle__/.test(callbackData)) {
                notificationType = callbackData.replace('toggle__', '');
                next(null, notificationType, user)
            } else if (/^toggle_/.test(callbackData)) {
                notificationType = callbackData.replace('toggle_', '');
                next(null, notificationType, user)
            }
        }, (notificationType, user, next) => {
            userDBO.findOne({
                userId: userId,
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null, result)
                } else {
                    ctx.reply('User not found.').catch((error) => {
                        logger.error(error)
                    })
                }
            })
        }, (user, next) => {
            if (!user.notificationTypes) {
                user.notificationTypes = []
            }

            const index = user.notificationTypes.indexOf(notificationType);
            if (index === -1) {
                user.notificationTypes.push(notificationType);
            } else {
                user.notificationTypes.splice(index, 1);
            }
            next(null, user)
        }, (user, next) => {
            userDBO.findOneAndUpdate({
                userId: userId,
            }, {
                $set: {
                    notificationTypes: user.notificationTypes
                }
            }, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null)
                } else {
                    ctx.reply('User not found.').catch((error) => {
                        logger.error(error)
                    })
                }
            })
        }, (next) => {
            ctx.deleteMessage().catch((error) => {
                logger.error(error)
            });
            next(null)
        }, (next) => {
            ctx.reply(`Notification Preferences Saved.\n To modify further, simply run the command again!`).catch((error) => {
                logger.error(error)
            }).then(() => {
                next(null);
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    })
}
  
const notificationIntrestedIn = (ctx) => {
    const userId = ctx.update.message.from.id

    async.waterfall([
        (next) => {
            userDBO.findOne({
                userId: userId,
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null, result)
                } else {
                    ctx.reply('User not found.').catch((error) => {
                        logger.error(error)
                    })
                }
            })
        }, (user, next) => {
            if (!user.notificationTypes) {
                user.notificationTypes = [];
            }
 
            const notificationTypes = user.notificationTypes
            const keyboard = notificationTypes
                .filter((type) => user.notificationTypes.includes(type))
                .map((type) => [Markup.button.callback(type, `toggle__${type}`, false)]);

            const replyMarkup = Markup.inlineKeyboard(keyboard);
            ctx.reply('Click notification your intrested in:', replyMarkup).catch((error) => {
                logger.error(error)
            }).then(() => {
                next(null);
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    })
}
  

module.exports = {
    notificationNotIntrestedIn,
    notificationIntrestedIn,
    toggleHandler
}