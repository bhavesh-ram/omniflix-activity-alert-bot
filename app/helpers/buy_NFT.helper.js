const async = require('async');
const userDBO = require('../dbos/user.dbo');
const activityDBO = require('../dbos/activity.dbo');
const botHelper = require('./bot.helper');
const templateUtil = require('../utils/template.util');
const logger = require('../../logger');

String.prototype.fmt = function (hash) {
    var string = this, key; 
    for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); 
    return string;
};

const buyNFTHelper = (activity) => {
    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.buyer
            }, {}, {}, false, (error, buyer) => {
                if (error) {
                    next(error);
                } else if (buyer) {
                    next(null, buyer.userId);
                } else {
                    logger.error('No buyer found!');
                    next(null, null);
                }
            });
        }, (buyer, next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.owner
            }, {}, {}, false, (error, owner) => {
                if (error) {
                    next(error);
                } else if (owner) {
                    next(null, buyer, owner.userId);
                } else {
                    logger.error('No owner found!');
                    next(null, buyer, null);
                }
            });
        }, (buyer, owner, next) => {
            const ownerMsg = templateUtil.buyNftHelperMsg.NftOwnerMsg.fmt({ ACTIVITYNFT_IDID: activity.nft_id.id });
            const mediaUrl = templateUtil.buyNftHelperMsg.url.fmt({ ACTIVITYNFT_IDID: activity.nft_id.id });
            
            if (activity && activity.nft_id && activity.nft_id.nsfw) {
                const previewUrl = 'https://f4.omniflix.market/assets/logos/og_image.png';
                const options = {
                    caption: ownerMsg,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[{ text: "NFT Sold", url: mediaUrl }]]
                    }
                }
                botHelper.sendPhotos([owner], previewUrl, options, (error) => {
                    if (error) {
                        logger.error(error);
                    } 
                    next(null, buyer);
                });
            } else {
                const options = {
                    caption: ownerMsg,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[{ text: "NFT Sold", url: mediaUrl }]]
                    }
                }
                botHelper.sendMessages([owner], ownerMsg, options, (error) => {
                    if (error) {
                        logger.error(error);
                    } 
                    next(null, buyer);
                });
            }
        }, (buyer, next) => {
            const buyerMsg = templateUtil.buyNftHelperMsg.NftBuyerMsg.fmt({ ACTIVITYNFT_IDID: activity.nft_id.id || activity.nft_id })
            const mediaUrl = templateUtil.buyNftHelperMsg.url.fmt({ ACTIVITYNFT_IDID: activity.nft_id.id || activity.nft_id  });

            if (activity && activity.nft_id && activity.nft_id.nsfw) {
                const previewUrl = 'https://f4.omniflix.market/assets/logos/og_image.png';
                const options = {
                    caption: buyerMsg,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[{ text: "You Bought New NFT", url: mediaUrl }]]
                    }
                }
                botHelper.sendPhotos([buyer], previewUrl, options, (error) => {
                    if (error) {
                        logger.error(error);
                    } 
                    next(null);
                });
            } else {
                const options = {
                    caption: buyerMsg,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[{ text: "You Bought New NFT", url: mediaUrl }]]
                    }
                }
                botHelper.sendMessages([buyer], buyerMsg, options, (error) => {
                    if (error) {
                        logger.error(error);
                    } 
                    next(null);
                });
            }
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

const burnNFTHelper = (activity) => {
    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.denom_id.creator
            }, {}, {}, false, (error, user) => {
                if (error) {
                    next(error);
                } else if (user) {
                    next(null, user.userId);
                } else {
                    logger.error('Burn ONFT user not subscribed');
                    next(null, null);
                }
            });
        }, (userId, next) => {
            const msg = templateUtil.burnNftHelperMsg.message.fmt({ ACTIVITYID: activity.id });
            const mediaUrl = templateUtil.burnNftHelperMsg.url.fmt({ ACTIVITYID: activity.id });
            
            botHelper.sendMessages([userId], msg, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: "Burned NFT", url: mediaUrl }]]
                }
            }, (error) => {
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

const mintONFTHelper = (activity) => {
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
                    result.forEach(user => {
                        creators.push(user.userId);
                    });
                    next(null, activityData, creators);
                } else {
                    next(null, activityData, []);
                }
            });
        }, (activityData, creators, next) => {
            const owners = [];
            userDBO.find({
                "isSubscribe": true,
                "omniflixAddress": activityData.owner
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result && result.length) {
                    result.forEach(user => {
                        owners.push(user.userId);
                    });
                    next(null, activityData, creators, owners);
                } else {
                    next(null, activityData, creators, []);
                }
            });
        }, (activityData, creators, owners, next) => {
            const msg = templateUtil.mintONFTHelperMsg.creatorMsg.fmt({ NFTID: activityData.id });
            const mediaUrl = templateUtil.mintONFTHelperMsg.url.fmt({ NFTID: activityData.id });
            
            if (activityData.nsfw) {
                const previewUrl = 'https://f4.omniflix.market/assets/logos/og_image.png';
                const options = {
                    caption: msg,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[{ text: "Minted New Nft", url: mediaUrl }]]
                    }
                }
                botHelper.sendPhotos(creators, previewUrl, options, (error) => {
                    if (error) {
                        logger.error(error);
                    } 
                    next(null, activityData, owners);
                });
            } else {
                const options = {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[{ text: "Minted New Nft", url: mediaUrl }]]
                    }
                }
                botHelper.sendMessages(creators, msg, options, (error) => {
                    if (error) {
                        logger.error(error);
                    } 
                    next(null, activityData, owners);
                });
            }
        }, (activityData, owners, next) => {
            const msg = templateUtil.mintONFTHelperMsg.ownerMsg.fmt({ NFTID: activityData.id });
            const mediaUrl = templateUtil.mintONFTHelperMsg.url.fmt({ NFTID: activityData.id });

            if (activityData.nsfw) {
                const previewUrl = 'https://f4.omniflix.market/assets/logos/og_image.png';
                const options = {
                    caption: msg,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[{ text: "Minted New Nft", url: mediaUrl }]]
                    }
                }
                botHelper.sendPhotos(owners, previewUrl, options, (error) => {
                    if (error) {
                        logger.error(error);
                    } 
                    next(null);
                });
            } else {
                const options = {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[{ text: "Minted New Nft", url: mediaUrl }]]
                    }
                }
                botHelper.sendMessages(owners, msg, options, (error) => {
                    if (error) {
                        logger.error(error);
                    } 
                    next(null);
                });
            }
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

const burnNFTClaimHelper = (activity) => {
    async.waterfall([
        (next) => {
            userDBO.findOne({
                "isSubscribe": true,
                "omniflixAddress": activity.owner
            }, {}, {}, false, (error, user) => {
                if (error) {
                    next(error);
                } else if (user) {
                    next(null, user.userId);
                } else {
                    logger.error('Burn ONFT user not subscribed');
                    next(null, null);
                }
            });
        }, (userId, next) => {
            const msg = templateUtil.burnNftHelperMsg.message.fmt({ ACTIVITYID: activity.id });
            const mediaUrl = templateUtil.burnNftHelperMsg.url.fmt({ ACTIVITYID: activity.id });

            botHelper.sendMessages([userId], msg, {
                reply_markup: {
                    inline_keyboard: [[{ text: "Burned NFT", url: mediaUrl }]]
                }
            }, (error) => {
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

module.exports = {
    buyNFTHelper,
    burnNFTHelper,
    mintONFTHelper,
    burnNFTClaimHelper
};