const async = require('async');
const request = require('request');
const cron = require('node-cron');
const channelDBO = require('../dbos/channel.dbo');
const userDBO = require('../dbos/user.dbo');
const channelHelper = require('../helpers/channel.helper');
const config = require('../../config');
const logger = require('../../logger');

const subscribedChannelsNotification = (ctx) => {
    const channelName = ctx.message.text ? ctx.message.text.split(' ')[1]: null;
    const userID = ctx.update.message.from.id;

    async.waterfall([
        (next) => {
            if (!channelName) {
                ctx.reply('Add Channel Name or Channel ID with command! \neg. /subscribechannel this_is_latest_channel')
                    .catch((err) => next(err));
            } else {
                next(null);
            }
        }, (next) => {
            channelDBO.findOne({
                $or: [
                    { name: channelName },
                    { username: channelName }
                ]
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, result);
                } else {
                    ctx.reply(`Invalid Channel Name/ID ${channelName}. Please Enter a Valid Channel Name or Channel ID.`)
                        .catch((err) => next(err));
                }
            })
        }, (channel, next) => {
            const channelID = channel.username;
            userDBO.findOne({
                userId: userID
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null, channelID, result);
                } else {
                    ctx.reply('User not found.')
                        .catch((err) => next(err));
                }
            })
        }, (channelID, user, next) => {
            if (user && !user.channels) {
                user.channels = [];
            }
            user.channels.push(channelID);
            userDBO.findOneAndUpdate({
                _id: user._id
            }, {
                $set: {
                    'user.channels': user.channels
                }
            }, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null);
                } else {
                    next('No user found');
                }
            })
        },
    ], (error) => {
        if (error) {
            logger.error(error);
        }else {
            ctx.reply('Channel Added successfully!')
                .catch((err) => {
                    logger.error(err);
                })
        }
    })
}

const unSubscribedChannelsNotification = (ctx) => {
    const channelName = ctx.message.text ? ctx.message.text.split(' ')[1]: null;
    const userID = ctx.update.message.from.id;

    async.waterfall([
        (next) => {
            if (!channelName) {
                ctx.reply('Add Channel Name or Channel ID with command! \neg. /unsubscribechannel this_is_latest_channel')
                    .catch((err) => next(err));
            } else {
                next(null);
            }
        }, (next) => {
            channelDBO.findOne({
                $or: [
                    { name: channelName },
                    { username: channelName }
                ]
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, result);
                } else {
                    ctx.reply(`Invalid Channel Name/ID ${channelName}. Please Enter a Valid Channel Name or Channel ID.`)
                        .catch((err) => next(err));
                }
            })
        }, (channel, next) => {
            const channelID = channel.username;
            userDBO.findOne({
                userId: userID
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null, channelID, result);
                } else {
                    ctx.reply('User not found.')
                        .catch((err) => next(err));
                }
            })
        }, (channelID, user, next) => {
            if (user && user.channels) {
                user.channels = user.channels.filter(
                    (channel) => channel !== channelID
                );
            }
            userDBO.findOneAndUpdate({
                _id: user._id
            }, {
                $set: {
                    'user.channels': user.channels
                }
            }, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null);
                } else {
                    next('No user found');
                }
            })
        },
    ], (error) => {
        if (error) {
            logger.error(error);
        } else {
            ctx.reply('Channel removed successfully!')
                .catch((err) => {
                    logger.error(err);
                })
        }
    })
}

const channelsFetching = () => {
    async.waterfall([
        (next) => {
            channelDBO.find({}, {}, {
                sort: {
                    created_at: 'desc'
                },
                limit: 1
            }, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result && result.length) {
                    next(null, result[0].created_at);
                } else {
                    next(null, new Date());
                }
            })
        }, (channel, next) => {
            const createdFrom = new Date(channel).toUTCString();
            const url = `${config.omniflix.studioUrl}/tv/channels?createdFrom=${createdFrom}&sortBy=created_at&order=asc&limit=1000`;
            const options = { json: true };
            request(url, options, (error, res, body) => {
                if (error) {
                    next(error);
                } else if (res && res.statusCode === 200) {
                    if (body && body.result && body.result.list) {
                        next(null, body.result.list);
                    } else {
                        next(null, []);
                    }
                } else {
                    next(null, []);
                }
            });
        }, (channels, next) => {
            async.forEachLimit(channels, 1, (channel, cb) => {
                channelDBO.findOne({
                    "_id": channel._id
                }, {}, {}, false, (error, result) => {
                    if (error) {
                        cb(error);
                    } else if (result) {
                        cb(null);
                    } else {
                        channel.isNotified = false;
                        channelHelper.addChannel(channel, (error) => {
                            if (error) {
                                cb(error);
                            } else {
                                cb(null);
                            }
                        })
                    }
                })
            }, (error) => {
                next(error);
            });
        },
    ], (error) => {
        if (error) {
            logger.error(error);
        } else {
            logger.info('Channels Fetched Successfully');
        }
    });
};

const channelScheduler = () => {
    async.waterfall([
        (next) => {
            channelDBO.find({
                "isNotified": false
            }, {}, {
                sort: {
                    created_at: 'desc'
                },
                limit: 1
            }, false, (error, channels) => {
                if (error) {
                    next(error);
                } else if (channels && channels.length) {
                    next(null, channels);
                } else {
                    next('No Channels Present');
                }
            })
        }, (channels, next) => {
            async.forEachLimit(channels, 1, (channel, cb) => {
                channelHelper.newChannelsHelper(channel, (error) => {
                    if (error) {
                        cb(error);
                    } else {
                        cb(null);
                    }
                })
            }, (error) => {
                next(error);
            });
        },
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    });
};

const channelSchedulerData = cron.schedule('0 * * * * *', channelScheduler);

const channelsFetch = cron.schedule('*/45 * * * * *', channelsFetching)

channelsFetch.start()


module.exports = {
    subscribedChannelsNotification,
    unSubscribedChannelsNotification,
    channelsFetch,
    channelSchedulerData,
}
