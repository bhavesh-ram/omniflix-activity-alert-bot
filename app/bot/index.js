const async = require('async');
const { Telegraf } = require('telegraf')
const config = require('../../config');
const logger = require('../../logger');

const bot = new Telegraf(config.bot.token);

const launch = (bot) => {
    async.waterfall([
        (next) => {        
            bot.launch(() => {
                next(null);
            }).catch((err)=> {
                logger.error('Bot is not connected. Network Issue');
                setTimeout(()=> {
                    launch(bot);
                }, 10000)
            })
        },
    ], (error) => {
        if (error) {
            logger.error(error);
        } else {
            logger.info('Bot is connected');
        }
    });
}

launch(bot);

module.exports = bot;