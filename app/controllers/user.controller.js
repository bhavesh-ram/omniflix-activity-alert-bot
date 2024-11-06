const async = require("async");
const userDBO = require("../dbos/user.dbo");
const logger = require('../../logger');
const templateUtil = require('../utils/template.util');

String.prototype.fmt = function (hash) {
    var string = this, key; for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); return string
}

const unSubscribeCMD = (ctx) => {
    console.time(`Processing update ${ctx.update.message.update_id}`);
    const data = ctx.update.message

    async.waterfall([
        (next) => {
            userDBO.findOne({
                userId: data.from.id
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null)
                } else {
                    ctx.reply('User Already Unsubscribed!').catch((error) => {
                        logger.error(error)
                    })
                }
            })
        }, (next) => {
            userDBO.findOneAndDelete({
                userId: data.from.id
            }, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null)
                } else {
                    ctx.reply('User not found.').catch((error) => {
                        logger.error(error);
                    })
                }
            })
        }, (next) => {
            ctx.reply('You Have Unsubscribed SuccessFully.').catch((error) => {
                logger.error(error);
            }).then(() => {
                next(null)
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    })
    console.timeEnd(`Processing update ${ctx.update.message.update_id}`);
}

const messageCMD = (ctx) => {
    console.time(`Processing update ${ctx.update.message.update_id}`);
    let words = ['chihuahua', 'mantle', 'cosmos', 'osmo', 'secret', 'akash', 'star', 'certik', 'regen', 'persistence', 'sent', 'juno', 'kava', 'stars']
    async.waterfall([
        (next) => {
            if (ctx.message.text == '/help' ||
                ctx.message.text == '/omniflix' ||
                ctx.message.text == '/about' ||
                ctx.message.text == '/start' ||
                ctx.message.text == '/join' ||
                ctx.message.text == '/subscribe') {
            } else if (!words.includes(ctx.message.text) && !ctx.message.text) {
            } else if (ctx.message.text.slice(0, 8) == 'omniflix') {
                if (parseInt(ctx.message.text.slice(8,).length) != 39) {
                    return ctx.reply('Add a correct OmniFlix address for accurate updates.').catch((error) => {
                        logger.error(error)
                    })
                }
                next(null)
            }
        }, (next) => {
            let data = ctx.update.message
            let doc = {
                userId: data.from.id,
                username: data.from.username,
                isSubscribe: true,
                omniflixAddress: ctx.message.text,
                chatDate: new Date(data.date * 1000)
            }
            userDBO.findOne({
                userId: data.from.id
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    ctx.reply('User Already Subscribed!').catch((error) => {
                    logger.error(error)
                    })
                } else {
                    next(null, doc)
                }
            })
        }, (doc, next) => {
            userDBO.save(doc, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null)
                } else {
                    ctx.reply('Error While Saving User!').catch((error) => {
                        logger.error(error)
                    })
                }
            })
        }, (next) => {
            ctx.reply('You Have Subscribed SuccessFully.').catch((error) => {
                logger.error(error)
            }).then(() => {
                next(null)
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    })
}

const changeAddress = (ctx) => {
    const accountAddress = ctx.message.text.split(' ')[1];
    const userId = ctx.update.message.from.id

    async.waterfall([
        (next) => { 
            if(!accountAddress){
                ctx.reply('Add Omniflix address with command! \neg. /changeaddress omniflix17d2f5cbhghiii6432dc8820dhrt6dg').catch((error) => {
                    logger.error(error)
                })
            } else if (accountAddress.startsWith('omniflix')) {
                next(null);
            } else {
                ctx.reply('Add a correct OmniFlix address for accurate updates.').catch((error) => {
                    logger.error(error)
                })
            }
        }, (next) => {
            userDBO.findOneAndUpdate({ 
                userId 
            }, {
                $set: {
                    omniflixAddress: accountAddress
                }
            }, {
                returnOriginal: false
            }, false, (error, result) => {
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
            if (user) {
                ctx.reply('Omniflix Address Updated Successfully!').catch((error) => {
                    logger.error(error)
                }).then(() => {
                    next(null)
                })
            }
        }
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    })
}

const startMsg = (ctx) => {
    ctx.reply(templateUtil.StartMsg.fmt({ USER_NAME: ctx.update.message.from.username })).catch((error) => {
        logger.error(error)
    })
}

const about = (ctx) =>{
    ctx.reply(templateUtil.aboutBot).catch((error) => {
        logger.error(error)
    })
}

const omniflix = (ctx) =>{
    ctx.reply(templateUtil.aboutOmniflix).catch((error) => {
        logger.error(error)
    })
}

const join = (ctx) =>{
    ctx.reply(templateUtil.joinBot).catch((error) => {
        logger.error(error)
    })
}

const help = (ctx) =>{
    ctx.reply(templateUtil.HelpMsg).catch((error) => {
        logger.error(error)
    })
}
  
const subscribe = (ctx) => {
    ctx.reply('Send your OmniFlix account address').catch((error) => {
        logger.error(error)
    })
}


module.exports = {
    changeAddress,
    messageCMD,
    unSubscribeCMD,
    startMsg,
    about,
    omniflix,
    join,
    help,
    subscribe
}