const async = require('async');
const userDBO = require('../dbos/user.dbo');
const activityDBO = require('../dbos/activity.dbo');
const botHelper = require('../helpers/bot.helper');
const logger = require('../../logger');
const bot = require('../bot');

const bulkMinting = (activity, totalCount) => {
    const msg = `***You have minted **${totalCount}** NFTs.***`

    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.creator
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null, result)
                } else {
                    logger.error('Bulk Mint NFT Owner Not subscribed')
                    next(null, null)
                }
            })
        }, (user, next) => {
            if (user) {
                next(null, user)
            } else {
                activityDBO.updateMany({
                    type: activity.type,
                    block: activity.block
                }, {
                    $set: { isNotified: true }
                }, (error) => {
                    if (error) {
                        next(error)
                    }
                })
            }
        }, (user, next) => {
            const options = {
                parse_mode: 'Markdown'
            }
            botHelper.sendMessages([user.userId], msg, options, (error) => {
                if (error) {
                    logger.error(error)
                } else {
                    next(null)
                }
            })
        }, (next) => {
            activityDBO.updateMany({
                type: activity.type,
                block: activity.block
            }, {
                $set: { 
                    isNotified: true 
                }
            }, (error) => {
                if (error) {
                    next(error)
                } else {
                    next(null)
                }
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    })
}


const bulkTransfer = (activity, totalCount) => {
    const msg = `***You have transferred **${totalCount}** NFTs.***`

    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.sender
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null, result)
                } else {
                    logger.error('Bulk Transfer NFT Owner Not subscribed')
                    next(null, null)
                }
            })
        }, (user, next) => {
            if (user) {
                next(null, user)
            } else {
                activityDBO.updateMany({
                    type: activity.type,
                    block: activity.block
                }, {
                    $set: { isNotified: true }
                }, (error) => {
                    if (error) {
                        next(error)
                    }
                })
            }
        }, (user, next) => {
            const options = {
                parse_mode: 'Markdown'
            }
            botHelper.sendMessages([user.userId], msg, options, (error) => {
                if (error) {
                    logger.error(error)
                } else {
                    next(null)
                }
            })
        }, (next) => {
            activityDBO.updateMany({
                type: activity.type,
                block: activity.block
            }, {
                $set: {
                    isNotified: true
                }
            }, (error) => {
                if (error) {
                    next(error)
                } else {
                    next(null)
                }
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    })
}

const bulkListingNft = (activity, totalCount) => {
    const msg = `**${totalCount}** ***New Listings On MarketPlace.***\n[View on Omniflix Market](https://omniflix.market/marketplace/collectNow)`
    
    let messageType;
    if(activity.type === 'MsgListNFT') {
        messageType = 'Multiple NFT Listings';
    }
    const user_chatId = []

    async.waterfall([
        (next) => {
            userDBO.find({
                "isSubscribe": true,
                notificationTypes: { $ne: messageType },
                $or: [
                    { collections: [] },
                    { collections: activity.denom_id.id }
                ]
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result && result.length) {
                    user_chatId.splice(0,)
                    result.forEach(user => {
                        user_chatId.push(user.userId)
                    })
                    next(null, user_chatId)
                } else {
                    logger.error('no User subscribed')
                    next(null, null)
                }
            })
        }, (user_chatId, next) => {
            if (user_chatId) {
                next(null, user_chatId)
            } else {
                activityDBO.updateMany({
                    type: activity.type,
                    block: activity.block
                }, {
                    $set: { isNotified: true }
                }, (error) => {
                    if (error) {
                        next(error)
                    }
                })
            }
        }, (user_chatId, next) => {
            const options = {
                parse_mode: 'Markdown'
            }
            botHelper.sendMessages(user_chatId, msg, options, (error) => {
                if (error) {
                    logger.error(error)
                } else {
                    next(null)
                }
            })
        }, (next) => {
            activityDBO.updateMany({
                type: activity.type,
                block: activity.block
            }, {
                $set: {
                    isNotified: true
                }
            }, (error) => {
                if (error) {
                    next(error)
                } else {
                    next(null)
                }
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    })
}

const bulkDeListingNft = (activity, totalCount) => {
    const msg = `**${totalCount}** ***NFTs DeListed From MarketPlace.***`

    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.owner
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null, result.userId)
                } else {
                    logger.error('DeListing NFT user not subscribed')
                    next(null, null, null)
                }
            })
        }, (user_chatIdOwner, next) => {
            if (user_chatIdOwner) {
                next(null, user_chatIdOwner)
            } else {
                activityDBO.updateMany({
                    type: activity.type,
                    block: activity.block
                }, {
                    $set: { isNotified: true }
                }, (error) => {
                    if (error) {
                        next(error)
                    }
                })
            }
        }, (user_chatIdOwner, next) => {
            const options = {
                parse_mode: 'Markdown'
            }
            botHelper.sendMessages([user_chatIdOwner], msg, options, (error) => {
                if (error) {
                    logger.error(error)
                } else {
                    next(null)
                }
            })
        }, (next) => {
            activityDBO.updateMany({
                type: activity.type,
                block: activity.block
            }, {
                $set: {
                    isNotified: true
                }
            }, (error) => {
                if (error) {
                    next(error)
                } else {
                    next(null)
                }
            })
        },
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    })
}

const bulkBurnNft = (activity, totalCount) => {
    const msg = `***You Burned **${totalCount}** NFTs.***`

    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.denom_id.creator
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null, result.userId)
                } else {
                    logger.error('Burn NFT user not subscribed')
                    next(null, null)
                }
            })
        }, (user_chatIdCreator, next) => {
            if (user_chatIdCreator) {
                next(null, user_chatIdCreator)
            } else {
                activityDBO.updateMany({
                    type: activity.type,
                    block: activity.block
                }, {
                    $set: { isNotified: true }
                }, (error) => {
                    if (error) {
                        next(error)
                    }
                })
            }
        }, (user_chatIdCreator, next) => {
            const options = {
                parse_mode: 'Markdown'
            }
            botHelper.sendMessages([user_chatIdCreator], msg, options, (error) => {
                if (error) {
                    logger.error(error)
                } else {
                    next(null)
                }
            })
        }, (next) => {
            activityDBO.updateMany({
                type: activity.type,
                block: activity.block
            }, {
                $set: {
                    isNotified: true
                }
            }, (error) => {
                if (error) {
                    next(error)
                } else {
                    next(null)
                }
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    })
}

const bulkAuction = (activity, totalCount) => {
    const msg = ` **${totalCount}** ***New Bulk Auction Listed On MarketPlace.***\n[View on Omniflix Market](https://omniflix.market/nft)`
    let messageType;
    if(activity.type === 'MsgCreateAuction') {
        messageType = 'Multiple Auctions Creation';
    }
    let user_chatId = []
    async.waterfall([
        (next) => {
            userDBO.find({
                "isSubscribe": true,
                notificationTypes: { $ne: messageType },
                $or: [
            { collections: [] },
            { collections: activity.denom_id.id }
                ]
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result && result.length) {
                    user_chatId.splice(0,)
                    result.forEach(user => {
                        user_chatId.push(user.userId)
                    })
                } else {
                    logger.error('no User subscribed')
                    next(null, null)
                }
            })
        }, (user_chatId, next) => {
            if (user_chatId) {
                next(null, user_chatId)
            } else {
                activityDBO.updateMany({
                    type: activity.type,
                    block: activity.block
                }, {
                    $set: { isNotified: true }
                }, (error) => {
                    if (error) {
                        next(error)
                    }
                })
            }
        }, (user_chatId, next) => {
            const options = {
                parse_mode: 'Markdown'
            }
            botHelper.sendMessages(user_chatId, msg, options, (error) => {
                if (error) {
                    logger.error(error)
                } else {
                    next(null)
                }
            })
        }, (next) => {
            activityDBO.updateMany({
                type: activity.type,
                block: activity.block
            }, {
                $set: {
                    isNotified: true
                }
            }, (error) => {
                if (error) {
                    next(error)
                } else {
                    next(null)
                }
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    })
}

const bulkAuctionCancel = (activity, totalCount) => {
    const msg = `**${totalCount}** *** Auction Cancel From MarketPlace.***`

    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.owner
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    let user_chatIdOwner = result.userId
                    botHelper.sendMessages([user_chatIdOwner], msg, options, (error) => {
                        if (error) {
                            logger.error(error)
                        } else {
                            next(null)
                        }
                    })
                } else {
                    logger.error('Auction Cancel Nft Owner Not subscribed')
                    next(null, null)
                }
            })
        }, (next) => {
            activityDBO.updateMany({
                type: activity.type,
                block: activity.block
            }, {
                $set: {
                    isNotified: true
                }
            }, (error) => {
                if (error) {
                    next(error)
                } else {
                    next(null)
                }
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    })
}

const bulkAuctionRemoved = (activity, totalCount) => {
    const msg = `**${totalCount}** ***Auctions Removed From MarketPlace.***`

    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.owner
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null, result.userId)
                } else {
                    logger.error('Auction Removed Nft Owner Not subscribed')
                    next(null, null)
                }
            })
        }, (user_chatIdOwner, next) => {
            if (user_chatIdOwner) {
                next(null, user_chatIdOwner)
            } else {
                activityDBO.updateMany({
                    type: activity.type,
                    block: activity.block
                }, {
                    $set: { isNotified: true }
                }, (error) => {
                    if (error) {
                        next(error)
                    }
                })
            }
        }, (user_chatIdOwner, next) => {
            const options = {
                parse_mode: 'Markdown'
            }
            botHelper.sendMessages([user_chatIdOwner], msg, options, (error) => {
                if (error) {
                    logger.error(error)
                } else {
                    next(null)
                }
            })
        }, (next) => {
            activityDBO.updateMany({
                type: activity.type,
                block: activity.block
            }, {
                $set: {
                    isNotified: true
                }
            }, (error) => {
                if (error) {
                    next(error)
                } else {
                    next(null)
                }
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    })
}


const bulkProcessBid = (activity, totalCount) => {
    const msg = `***You Won **${totalCount}** Auctions.***`

    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.bidder
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null, result.userId)
                } else {
                    next('Process Bid Nft Owner Not subscribed')
                }
            })
        }, (user_chatIdBidder, next) => {
            if (user_chatIdBidder) {
                next(null, user_chatIdBidder)
            } else {
                activityDBO.updateMany({
                    type: activity.type,
                    block: activity.block
                }, {
                    $set: { isNotified: true }
                }, (error) => {
                    if (error) {
                        next(error)
                    }
                })
            }
        }, (user_chatIdBidder, next) => {
            const options = {
                parse_mode: 'Markdown'
            }
            botHelper.sendMessages([user_chatIdBidder], msg, options, (error) => {
                if (error) {
                    logger.error(error)
                } else {
                    next(null)
                }
            })
        }, (next) => {
            activityDBO.updateMany({
                type: activity.type,
                block: activity.block
            }, {
                $set: {
                    isNotified: true
                }
            }, (error) => {
                if (error) {
                    next(error)
                } else {
                    next(null)
                }
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    })
}

const bulkPlaceBid = (activity, totalCount) => {
    const msg = `***You Place **${totalCount}** bids.***`

    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.bidder
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null, result.userId)
                } else {
                    logger.error('Place Bid Nft Owner Not subscribed')
                    next(null, null)
                }
            })
        }, (user_chatIdBidder, next) => {
            if (user_chatIdBidder) {
                next(null, user_chatIdBidder)
            } else {
                activityDBO.updateMany({
                    type: activity.type,
                    block: activity.block
                }, {
                    $set: { isNotified: true }
                }, (error) => {
                    if (error) {
                        next(error)
                    }
                })
            }
        }, (user_chatIdBidder, next) => {
            const options = {
                parse_mode: 'Markdown'
            }
            botHelper.sendMessages([user_chatIdBidder], msg, options, (error) => {
                if (error) {
                    logger.error(error)
                } else {
                    next(null)
                }
            })
        }, (next) => {
            activityDBO.updateMany({
                type: activity.type,
                block: activity.block
            }, {
                $set: {
                    isNotified: true
                }
            }, (error) => {
                if (error) {
                    next(error)
                } else {
                    next(null)
                }
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    })
}

const bulkBuyNft = (activity, totalCount) => {
    const msg = `***You Bought **${totalCount}** Nfts.***`

    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.buyer
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null, result.userId)
                } else {
                    logger.error('Buy Nft Owner Not subscribed')
                    next(null, null)
                }
            })
        }, (user_chatIdBuyer, next) => {
            if (user_chatIdBuyer) {
                next(null, user_chatIdBuyer)
            } else {
                activityDBO.updateMany({
                    type: activity.type,
                    block: activity.block
                }, {
                    $set: { isNotified: true }
                }, (error) => {
                    if (error) {
                        next(error)
                    }
                })
            }
        }, (user_chatIdBuyer, next) => {
            const options = {
                parse_mode: 'Markdown'
            }
            botHelper.sendMessages([user_chatIdBuyer], msg, options, (error) => {
                if (error) {
                    logger.error(error)
                } else {
                    next(null)
                }
            })
        }, (next) => {
            activityDBO.updateMany({
                type: activity.type,
                block: activity.block
            }, {
                $set: {
                    isNotified: true
                }
            }, (error) => {
                if (error) {
                    next(error)
                } else {
                    next(null)
                }
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error)
        }
    })
}

const bulkCreateCollection = (activity, totalCount) => {
    const msg = `***You Created **${totalCount}** Collections.***`;

    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.creator
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, result.userId);
                } else {
                    logger.error('Bulk Collection Create Owner Not subscribed');
                    next(null, null);
                }
            });
        }, (user_chatIdCreator, next) => {
            if (user_chatIdCreator) {
                next(null, user_chatIdCreator)
            } else {
                activityDBO.updateMany({
                    type: activity.type,
                    block: activity.block
                }, {
                    $set: { isNotified: true }
                }, (error) => {
                    if (error) {
                        next(error)
                    }
                })
            }
        }, (user_chatIdCreator, next) => {
            const options = {
                parse_mode: 'Markdown'
            };
            botHelper.sendMessages([user_chatIdCreator], msg, options, (error) => {
                if (error) {
                    logger.error(error)
                } else {
                    next(null)
                }
            })
        }, (next) => {
            activityDBO.updateMany({
                type: activity.type,
                block: activity.block
            }, {
                $set: {
                    isNotified: true
                }
            }, (error) => {
                if (error) {
                    next(error)
                } else {
                    next(null)
                }
            })
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    });
};

const bulkTransferCollection = (activity, totalCount) => {
    const msg = `***You Transfered **${totalCount}** Collections.***`;

    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.creator
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, result.userId);
                } else {
                    logger.error('Bulk Collection Transfer Owner Not subscribed');
                    next(null, null);
                }
            });
        }, (user_chatIdCreator, next) => {
            if (user_chatIdCreator) {
                next(null, user_chatIdCreator)
            } else {
                activityDBO.updateMany({
                    type: activity.type,
                    block: activity.block
                }, {
                    $set: { isNotified: true }
                }, (error) => {
                    if (error) {
                        next(error)
                    }
                })
            }
        }, (user_chatIdCreator, next) => {
            const options = {
                parse_mode: 'Markdown'
            };
            botHelper.sendMessages([user_chatIdCreator], msg, options, (error) => {
                if (error) {
                    next(error);
                } else {
                    next(null);
                }
            });
        }, (next) => {
            activityDBO.updateMany({
                type: activity.type,
                block: activity.block
            }, {
                $set: {
                    isNotified: true
                }
            }, (error) => {
                next(error);
            });
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    });
};

const bulkUpdateCollection = (activity, totalCount) => {
    const msg = `***You Updated **${totalCount}** Collections.***`;

    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.creator
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, result.userId);
                } else {
                    next('Bulk Collection Update Owner Not subscribed');
                }
            });
        }, (user_chatIdCreator, next) => {
            if (user_chatIdCreator) {
                next(null, user_chatIdCreator)
            } else {
                activityDBO.updateMany({
                    type: activity.type,
                    block: activity.block
                }, {
                    $set: { isNotified: true }
                }, (error) => {
                    if (error) {
                        next(error)
                    }
                })
            }
        }, (user_chatIdCreator, next) => {
            const options = {
                parse_mode: 'Markdown'
            };
            botHelper.sendMessages([user_chatIdCreator], msg, options, (error) => {
                if (error) {
                    next(error);
                } else {
                    next(null);
                }
            });
        }, (next) => {
            activityDBO.updateMany({
                type: activity.type,
                block: activity.block
            }, {
                $set: {
                    isNotified: true
                }
            }, (error) => {
                next(error);
            });
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    });
};

const bulkCreateCampaign = (activity, totalCount) => {
    const msg = `***You Created **${totalCount}** Campaigns.***`;

    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.creator
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, result.userId);
                } else {
                    logger.error('Bulk Campaign Created Owner Not subscribed');
                    next(null, null);
                }
            });
        }, (user_chatIdCreator, next) => {
            if (user_chatIdCreator) {
                next(null, user_chatIdCreator)
            } else {
                activityDBO.updateMany({
                    type: activity.type,
                    block: activity.block
                }, {
                    $set: { isNotified: true }
                }, (error) => {
                    if (error) {
                        next(error)
                    }
                })
            }
        }, (user_chatIdCreator, next) => {
            const options = {
                parse_mode: 'Markdown'
            };
            botHelper.sendMessages([user_chatIdCreator], msg, options, (error) => {
                if (error) {
                    next(error);
                } else {
                    next(null);
                }
            });
        }, (next) => {
            activityDBO.updateMany({
                type: activity.type,
                block: activity.block
            }, {
                $set: {
                    isNotified: true
                }
            }, (error) => {
                next(error);
            });
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    });
};

const bulkCancelCampaign = (activity, totalCount) => {
    const msg = `***You Canceled **${totalCount}** Campaigns.***`;
    
    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.creator
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, result.userId);
                } else {
                    logger.error('Bulk Campaign Canceled Owner Not subscribed');
                    next(null, null);
                }
            });
        }, (user_chatIdCreator, next) => {
            if (user_chatIdCreator) {
                next(null, user_chatIdCreator)
            } else {
                activityDBO.updateMany({
                    type: activity.type,
                    block: activity.block
                }, {
                    $set: { isNotified: true }
                }, (error) => {
                    if (error) {
                        next(error)
                    }
                })
            }
        }, (user_chatIdCreator, next) => {
            const options = {
                parse_mode: 'Markdown'
            };
            botHelper.sendMessages([user_chatIdCreator], msg, options, (error) => {
                if (error) {
                    next(error);
                } else {
                    next(null);
                }
            });
        }, (next) => {
            activityDBO.updateMany({
                type: activity.type,
                block: activity.block
            }, {
                $set: {
                    isNotified: true
                }
            }, (error) => {
                next(error);
            });
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    });
};

const bulkDepositCampaign = (activity, totalCount) => {
    const msg = `***You Deposit **${totalCount}** Campaigns.***`;
    
    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.creator
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, result.userId);
                } else {
                    logger.error('Bulk Campaign Deposit Owner Not subscribed');
                    next(null, null);
                }
            });
        }, (user_chatIdCreator, next) => {
            if (user_chatIdCreator) {
                next(null, user_chatIdCreator)
            } else {
                activityDBO.updateMany({
                    type: activity.type,
                    block: activity.block
                }, {
                    $set: { isNotified: true }
                }, (error) => {
                    if (error) {
                        next(error)
                    }
                })
            }
        }, (user_chatIdCreator, next) => {
            const options = {
                parse_mode: 'Markdown'
            };
            botHelper.sendMessages([user_chatIdCreator], msg, options, (error) => {
                if (error) {
                    next(error);
                } else {
                    next(null);
                }
            });
        }, (next) => {
            activityDBO.updateMany({
                type: activity.type,
                block: activity.block
            }, {
                $set: {
                    isNotified: true
                }
            }, (error) => {
                next(error);
            });
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    });
};

const bulkEndCampaign = (activity, totalCount) => {
    const msg = `*** Total **${totalCount}** Campaigns Ended.***`;
    
    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.creator
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, result.userId);
                } else {
                    logger.error('Bulk Campaign End Owner Not subscribed');
                    next(null, null);
                }
            });
        }, (user_chatIdCreator, next) => {
            if (user_chatIdCreator) {
                next(null, user_chatIdCreator)
            } else {
                activityDBO.updateMany({
                    type: activity.type,
                    block: activity.block
                }, {
                    $set: { isNotified: true }
                }, (error) => {
                    if (error) {
                        next(error)
                    }
                })
            }
        }, (user_chatIdCreator, next) => {
            const options = {
                parse_mode: 'Markdown'
                };
            botHelper.sendMessages([user_chatIdCreator], msg, options, (error) => {
                if (error) {
                    next(error);
                } else {
                    next(null);
                }
            });
        }, (next) => {
            activityDBO.updateMany({
                type: activity.type,
                block: activity.block
            }, {
                $set: {
                    isNotified: true
                }
            }, (error) => {
                next(error);
            });
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    });
};

module.exports = {
    bulkAuction,
    bulkListingNft,
    bulkAuctionCancel,
    bulkAuctionRemoved,
    bulkDeListingNft,
    bulkBurnNft,
    bulkMinting,
    bulkTransfer,
    bulkCreateCollection,
    bulkTransferCollection,
    bulkUpdateCollection,
    bulkProcessBid,
    bulkPlaceBid,
    bulkBuyNft,
    bulkCreateCampaign,
    bulkCancelCampaign,
    bulkDepositCampaign,
    bulkEndCampaign,
}