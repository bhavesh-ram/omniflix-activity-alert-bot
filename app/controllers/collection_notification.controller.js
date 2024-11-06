const async = require('async');
const userDBO = require('../dbos/user.dbo');

const subscribedCollectionNotification = (ctx) => {
    const collectionAddress = ctx.message.text ? ctx.message.text.split(' ')[1]: null;
    const userID = ctx.update.message.from.id;
    
    async.waterfall([
        (next) => {
            if (!collectionAddress) {
                ctx.reply('Add Collection Address with command! \neg. /addcollection onftdenom7d2f5cbhghiii6432dc8820d2chgr7')
                    .catch((err) => next(err));
            } else if (!collectionAddress.startsWith('onftdenom')) {
                ctx.reply('Invalid Collection Address. Please Enter a Valid Collection Address.')
                    .catch((err) => next(err));
            } else {
                next(null);
            }
        }, (next) => {
            userDBO.findOne({
                userId: userID
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, result);
                } else {
                    ctx.reply('User not found.')
                        .catch((err) => next(err));
                }
            })
        }, (user, next) => {
            if (user && !user.collections) {
                user.collections = [];
            }
            user.collections.push(collectionAddress);
            userDBO.findOneAndUpdate({
                _id: user._id
            }, {
                $set: {
                    'user.collections': user.collections
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
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        } else {
            ctx.reply('Collection Added successfully!')
                .catch((err) => {
                    logger.error(err);
                })
        }
    });
};

const unSubscribedCollectionNotification = async (ctx) => {
    const collectionAddress = ctx.message.text ? ctx.message.text.split(' ')[1]: null;
    const userID = ctx.update.message.from.id

    async.waterfall([
        (next) => {
            if (!collectionAddress) {
                ctx.reply('Remove Collection from list with command! \neg. /removecollection onftdenom7d2f5cbhghiii6432dc8820d2chgr7')
                    .catch((err) => next(err));
            } else if (!collectionAddress.startsWith('onftdenom')) {
                ctx.reply('Invalid Collection Address. Please Enter a Valid Collection Address.')
                    .catch((err) => next(err));
            } else {
                next(null);
            }
        }, (next) => {
            userDBO.findOne({
                userId: userID
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error)
                } else if (result) {
                    next(null, result);
                } else {
                    ctx.reply('User not found.')
                        .catch((err) => next(err));
                }
            })
        }, (user, next) => {
            if (user) {
                user.collections = user.collections.filter(
                    (collection) => collection !== collectionAddress
                );
                userDBO.findOneAndUpdate({
                    _id: user._id
                }, {
                    $set: {
                        'user.collections': user.collections
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
            }
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        } else {
            ctx.reply('Collection Removed successfully!')
                .catch((err) => {
                    logger.error(err);
                })
        }
    });
}

module.exports = {
    subscribedCollectionNotification,
    unSubscribedCollectionNotification,
};
