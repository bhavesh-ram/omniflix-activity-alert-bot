const async = require('async');
const date = require('date-and-time');
const activityDBO = require('../dbos/activity.dbo');
const userDBO = require('../dbos/user.dbo');
const botHelper = require('./bot.helper');
const templateUtil = require('../utils/template.util');
const logger = require('../../logger');

String.prototype.fmt = function (hash) {
    var string = this, key; for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); return string
}

const createAuctionHelper = (activity) => {
    let messageType;
    if (activity.type === 'MsgCreateAuction') {
        messageType = "New Auction Creation"
    }
    const user_chatId = []
    async.waterfall([
        (next) => {
            userDBO.find({
                "isSubscribe": true,
                notificationTypes: { $ne: messageType },
                $or: [
                    { collections: [] },
                    { collections: activity.denom_id }
                ]
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result && result.length) {
                    user_chatId.splice(0,)
                    result.forEach((user) => {
                        user_chatId.push(user.userId)
                    })
                    next(null);
                } else {
                    logger.error('No Users Subscribed!');
                    next(null);
                }
            })
        }, (next) => {
            const msg = templateUtil.createAuctionMsg.message.fmt({
                ACTIVITYNFT_IDID: activity.nft_id,
                START_DATE: date.format(activity.start_time, 'ddd MMM YYYY at HH:MM [UTC]'),
                END_DATE: date.format(activity.end_time, 'ddd MMM YYYY at HH:MM [UTC]')
            });
            const mediaUrl = templateUtil.createAuctionMsg.url.fmt({ ACTIVITYNFT_IDID: activity.nft_id });
            if (activity.nft_id.nsfw) {
                const previewUrl = 'https://f4.omniflix.market/assets/logos/og_image.png';
                const options = {
                    caption: msg,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "New Auction Created", url: mediaUrl }
                            ]
                        ]
                    }
                }
                next(null, previewUrl, options, true);
            } else {
                const options = {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "New Auction Created", url: mediaUrl }
                            ]
                        ]
                    }
                }
                next(null, msg, options, false);
            }
        }, (msg, options, isPhoto, next) => {
            if (isPhoto) {
                botHelper.sendPhotos(user_chatId, msg, options, (error) => {
                    if (error) {
                        logger.error(error);
                    }
                    next(null);
                })
            } else {
                botHelper.sendMessages(user_chatId, msg, options, (error) => {
                    if (error) {
                        logger.error(error);
                    }
                    next(null);
                })
            }
        }, (next) => {
            activityDBO.findOneAndUpdate({
                _id: activity._id,
            }, {
                $set: {
                    "isNotified": true,
                }
            }, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null)
                } else {
                    next('No Activity Found!');
                }
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    });
};

const cancelAuctionHelper = (activity) => {
    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.owner
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, result.userId, result.omniflixAddress);
                } else {
                    logger.error('No Auction Owner Found!');
                    next(null, null, null);
                }
            })
        }, (ownerId, ownerAddress, next) => {
            if (!ownerId && ownerAddress) {
                activityDBO.findOneAndUpdate({
                    _id: activity._id,
                }, {
                    $set: {
                        "isNotified": true,
                    }
                }, {}, false, (error, result) => {
                    if (error) {
                        next(error);
                    } else if (!result) {
                        next('No Auction Found!')
                    }
                })
            } else {
                next(null, ownerId)
            }
        }, (ownerId, next) => {
            const msg = templateUtil.cancelAuctionMsg.message.fmt({
                ACTIVITYNFT_IDID: activity.nft_id,
            })
            const mediaUrl = templateUtil.cancelAuctionMsg.url.fmt({
                ACTIVITYNFT_IDID: activity.nft_id,
            })
            if (activity && activity.nft && activity.nft.nsfw) {
                const previewUrl = 'https://f4.omniflix.market/assets/logos/og_image.png';
                const options = {
                    caption: msg,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "Auction Cancelled", url: mediaUrl }
                            ]
                        ]
                    }
                }
                next(null, ownerId, previewUrl, options, true);
            } else {
                const options = {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "Auction Cancelled", url: mediaUrl }
                            ]
                        ]
                    }
                }
                next(null, ownerId, msg, options, false)
            }
        }, (ownerId, msg, options, isPhoto, next) => {
            if (isPhoto) {
                botHelper.sendPhotos([ownerId], msg, options, (error) => {
                    if (error) {
                        logger.error(error);
                    }
                    next(null);
                })
            } else {
                botHelper.sendMessages([ownerId], msg, options, (error) => {
                    if (error) {
                        logger.error(error);
                    }
                    next(null);
                })
            }
        }, (next) => {
            activityDBO.findOneAndUpdate({
                _id: activity._id,
            }, {
                $set: {
                    "isNotified": true,
                }
            }, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null);
                } else {
                    next('No activity Found!')
                }
            });
        },
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    });
};

const removeAuctionHelper = (activity) => {
    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.owner
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, result.userId, result.omniflixAddress);
                } else {
                    next(null, null, null);
                }
            })
        }, (ownerId, ownerAddress, next) => {
            if (!ownerId && !ownerAddress) {
                activityDBO.findOneAndUpdate({
                    _id: activity._id,
                }, {
                    $set: {
                        "isNotified": true,
                    }
                }, {}, false, (error, result) => {
                    if (error) {
                        next(error);
                    } else if (!result) {
                        next('No Auction Found!')
                    }
                })
            } else {
                next(null, ownerId)
            }
        }, (ownerId, next) => {
            const msg = templateUtil.removeAuctionMsg.message.fmt({
                ACTIVITYNFT_IDID: activity.nft_id,
            })
            const mediaUrl = templateUtil.removeAuctionMsg.url.fmt({
                ACTIVITYNFT_IDID: activity.nft_id,
            })
            const options = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "Auction Removed", url: mediaUrl }
                        ]
                    ]
                }
            }
            next(null, ownerId, msg, options)
        }, (ownerId, msg, options, next) => {
            botHelper.sendMessages([ownerId], msg, options, (error) => {
                if (error) {
                    logger.error(error);
                }
                next(null);
            })
        }, (next) => {
            activityDBO.findOneAndUpdate({
                _id: activity._id,
            }, {
                $set: {
                    "isNotified": true,
                }
            }, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null);
                } else {
                    next('No activity Found!')
                }
            });
        },
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    });
};

const processBidAuctionHelper = (activity) => {
    let user_chatIdBidder
    let user_omniflixAddressBidder
    let user_chatIdOwner
    let user_omniflixAddressOwner

    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.bidder
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    user_chatIdBidder = result.userId
                    user_omniflixAddressBidder = result.omniflixAddress
                    next(null);
                } else {
                    console.log('Process Bid Bidder Not Subscribed!')
                    next(null)
                }
            })
        }, (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.owner
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    user_chatIdOwner = result.userId
                    user_omniflixAddressOwner = result.omniflixAddress
                    next(null);
                } else {
                    logger.error('Process Bid Owner Not Subscribed!')
                    next(null)
                }
            })
        }, (next) => {
            if (user_omniflixAddressBidder && user_chatIdBidder) {
                const msg = templateUtil.processBidAuctionHelperMsg.auctionWonMsg.fmt({
                    ACTIVITYNFT_IDID: activity.nft_id
                })
                const mediaUrl = templateUtil.processBidAuctionHelperMsg.url.fmt({
                    ACTIVITYNFT_IDID: activity.nft_id
                })
                if (activity && activity.nft && activity.nft.nsfw) {
                    const previewUrl = 'https://f4.omniflix.market/assets/logos/og_image.png'
                    const options = {
                        caption: msg,
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: "Auction Won", url: mediaUrl }
                                ]
                            ]
                        }
                    }
                    botHelper.sendPhotos([user_chatIdBidder], previewUrl, options, (error) => {
                        if (error) {
                            logger.error(error);
                        }
                        next(null);
                    })
                } else {
                    const options = {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: "Auction Won", url: mediaUrl }
                                ]
                            ]
                        }
                    }
                    botHelper.sendMessages([user_chatIdBidder], msg, options, (error) => {
                        if (error) {
                            logger.error(error);
                        }
                        next(null);
                    })
                }
            } else {
                next(null);
            }
        }, (next) => {
            if (user_omniflixAddressOwner && user_chatIdOwner) {
                const msg = templateUtil.processBidAuctionHelperMsg.auctionEndMsg.fmt({
                    ACTIVITYNFT_IDID: activity.nft_id
                })
                const mediaUrl = templateUtil.processBidAuctionHelperMsg.url.fmt({
                    ACTIVITYNFT_IDID: activity.nft_id
                })
                if (activity && activity.nft && activity.nft.nsfw) {
                    const previewUrl = 'https://f4.omniflix.market/assets/logos/og_image.png'
                    const options = {
                        caption: msg,
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: "Auction End", url: mediaUrl }
                                ]
                            ]
                        }
                    }
                    botHelper.sendPhotos([user_chatIdOwner], previewUrl, options, (error) => {
                        if (error) {
                            logger.error(error);
                        }
                        next(null);
                    })
                } else {
                    const options = {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: "Auction End", url: mediaUrl }
                                ]
                            ]
                        }
                    }
                    botHelper.sendMessages([user_chatIdOwner], msg, options, (error) => {
                        if (error) {
                            logger.error(error);
                        }
                        next(null);
                    })
                }
            } else {
                next(null);
            }
        }, (next) => {
            activityDBO.findOneAndUpdate({
                _id: activity._id,
            }, {
                $set: {
                    "isNotified": true,
                }
            }, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null)
                } else {
                    next('No Activity Found!')
                }
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    })
};

const placeBidAuctionHelper = (activity) => {
    const userIds = [];

    async.waterfall([
        (next) => {
            activityDBO.findOne({
                _id: activity._id,
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
        //     userDBO.find({
        //         isSubscribe: true,
        //         omniflixAddress: activityResponse.nft.owner
        //     }, {}, {}, false, (error, result) => {
        //         if (error) {
        //             next(error);
        //         } else if (result && result.length) {
        //             result.forEach((user) => {
        //                 userIds.push(user.userId);
        //             })
        //             next(null, activityResponse);
        //         } else {
        //             next('No Owners found!');
        //         }
        //     })
        // }, (activityResponse, next) => {
        //     const msg = templateUtil.placeBidAuctionHelperMsg.ownerMsg.fmt({ NFTID: activityResponse.nft_id })
        //     const mediaUrl = templateUtil.placeBidAuctionHelperMsg.url.fmt({ NFTID: activityResponse.nft_id })

        //     if (activityResponse && activityResponse.nft && activityResponse.nft.nsfw) {
        //         const previewUrl = 'https://f4.omniflix.market/assets/logos/og_image.png'
        //         const options = {
        //             caption: msg,
        //             parse_mode: 'Markdown',
        //             reply_markup: {
        //                 inline_keyboard: [
        //                     [
        //                         { text: "New Bid Placed", url: mediaUrl }
        //                     ]
        //                 ]
        //             }
        //         }
        //         botHelper.sendPhotos(userIds, previewUrl, options, (error) => {
        //             if (error) {
        //                 logger.error(error);
        //             }
        //             next(null, activityResponse);
        //         })
        //     } else {
        //         const options = {
        //             parse_mode: 'Markdown',
        //             reply_markup: {
        //                 inline_keyboard: [
        //                     [
        //                         { text: "New Bid Placed", url: mediaUrl }
        //                     ]
        //                 ]
        //             }
        //         }
        //         botHelper.sendMessages(userIds, msg, options, (error) => {
        //             if (error) {
        //                 logger.error(error);
        //             }
        //             next(null, activityResponse);
        //         })
        //     }
        // }, (activityResponse, next) => {
            const nftId = activityResponse.nft_id;
            userIds.splice(0,)
            userDBO.find({
                isSubscribe: true,
                omniflixAddress: activityResponse.bidder
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result && result.length) {
                    result.forEach((user) => {
                        userIds.push(user.userId);
                    })
                    next(null, activityResponse, nftId);
                } else {
                    logger.error('No Bidders found');
                    next(null, activityResponse, nftId);
                }
            })
        }, (activityResponse, nftId, next) => {
            const msg = templateUtil.placeBidAuctionHelperMsg.bidderMsg.fmt({ NFTID: nftId })
            const mediaUrl = templateUtil.placeBidAuctionHelperMsg.url.fmt({ NFTID: nftId })

            if (activity && activity.nft && activity.nft.nsfw) {
                const previewUrl = 'https://f4.omniflix.market/assets/logos/og_image.png';
                const options = {
                    caption: msg,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "You Placed New Bid", url: mediaUrl }
                            ]
                        ]
                    }
                }
                botHelper.sendPhotos(userIds, previewUrl, options, (error) => {
                    if (error) {
                        logger.error(error);
                    }
                    next(null, activityResponse);
                })
            } else {
                const options = {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "You Placed New Bid", url: mediaUrl }
                            ]
                        ]
                    }
                }
                botHelper.sendMessages(userIds, msg, options, (error) => {
                    if (error) {
                        logger.error(error);
                    }
                    next(null, activityResponse);
                })
            }
        }, (activityResponse, next) => {
            activityDBO.find({
                auction_id: activityResponse.auction_id,
            }, {}, {
                sortBy: {
                    'amount.amount': -1,
                },
                limit: 2
            }, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result && result.length) {
                    next(null, activityResponse, result)
                } else {
                    next(null, activityResponse, null);
                }
            })
        }, (activityResponse, previousBidder, next) => {
            activityDBO.findOneAndUpdate({
                _id: activity._id,
            }, {
                $set: {
                    isNotified: true,
                }
            }, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    if (previousBidder) {
                        next(null, activityResponse, previousBidder);
                    }
                } else {
                    next('No activity found!');
                }
            })
        }, (activityResponse, previousBidder, next) => {
            userIds.splice(0,)
            userDBO.findOne({
                isSubscribe: true,
                omniflixAddress: previousBidder[1].bidder
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result && result.length) {
                    result.forEach((user) => {
                        userIds.push(user.userId);
                    })
                    next(null, activityResponse, previousBidder[1]);
                } else {
                    logger.error('No Users Found!')
                    next(null, activityResponse, null);
                }
            })
        }, (activityResponse, previousBidder, next) => {
            const msg = templateUtil.placeBidAuctionHelperMsg.previousBidderMsg.fmt({ NFTID: activityResponse.nft_id })
            const mediaUrl = templateUtil.placeBidAuctionHelperMsg.url.fmt({ NFTID: activityResponse.nft_id })

            if (activity && activity.nft && activity.nft.nsfw) {
                const previewUrl = 'https://f4.omniflix.market/assets/logos/og_image.png'
                const options = {
                    caption: msg,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "Bid Overbidden", url: mediaUrl }
                            ]
                        ]
                    }
                }
                botHelper.sendPhotos(userIds, previewUrl, options, (error) => {
                    if (error) {
                        logger.error(error);
                    }
                    next(null);
                })
            } else {
                const options = {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "Bid Overbidden", url: mediaUrl }
                            ]
                        ]
                    }
                }
                botHelper.sendMessages(userIds, msg, options, (error) => {
                    if (error) {
                        logger.error(error);
                    }
                    next(null);
                })
            }
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    })
};


module.exports = {
    createAuctionHelper,
    cancelAuctionHelper,
    removeAuctionHelper,
    processBidAuctionHelper,
    placeBidAuctionHelper
}

