const async = require('async');
const activityDBO = require('../dbos/activity.dbo');
const userDBO = require('../dbos/user.dbo');
const botHelper = require('./bot.helper');
const templateUtil = require('../utils/template.util');
const logger = require('../../logger');
const bot = require('../bot');

String.prototype.fmt = function (hash) {
    var string = this, key; for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); return string
}

const executeContractMintONFTHelper = (activity) => {
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
                isSubscribe: true,
                omniflixAddress: activityResponse.owner
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, activityResponse, result.userId);
                } else {
                    next(null, activityResponse, null);
                }
            })
        }, (activityResponse, userId, next) => {
            if (activityResponse && activityResponse.denom && activityResponse.denom.contract_owner) {
                userDBO.findOne({
                    omniflixAddress: activityResponse.denom.contract_owner
                }, {}, {}, false, (error, result) => {
                    if (error) {
                        next(error);
                    } else if (result) {
                        next(null, activityResponse, userId, result.userId);
                    } else {
                        next(null, activityResponse, userId, null);
                    }
                })
            } else {
                next(null, activityResponse, userId, null);
            }
        }, (activityResponse, userId, contractOwnerResponse, next) => {
            if (!userId && !contractOwnerResponse) {
                activityDBO.findOneAndUpdate({
                    _id: activityResponse._id
                }, {
                    $set: {
                        isNotified: true
                    }
                }, {}, false, (error, result) => {
                    if (error) {
                        next(error);
                    } else if (!result) {
                        next('Failed to update activity!');
                    }
                })
            } else {
                next(null, activityResponse, userId, contractOwnerResponse);
            }
        }, (activityResponse, userId, contractOwnerResponse, next) => {
            if (userResponse) {
                const msg = templateUtil.msgExecuteContractMintONFTMsg.message.fmt({
                    ACTIVITYNFT_IDID: activityResponse.nft_id
                });
                const url = templateUtil.msgExecuteContractMintONFTMsg.url.fmt({
                    ACTIVITYNFT_IDID: activityResponse.nft_id
                });
                if (activityResponse.nsfw) {
                    const previewUrl = 'https://f4.omniflix.market/assets/logos/og_image.png';
                    botHelper.sendPhotos([userId], previewUrl, {
                        caption: msg,
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: 'View on Omniflix Market', url: url }]
                            ]
                        }
                    }, (error) => {
                        if (error) {
                            logger.error(error);
                        }
                        next(null, activityResponse, contractOwnerResponse);
                    });
                } else {
                    botHelper.sendMessages([userId], msg, {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: 'View on Omniflix Market', url: url }]
                            ]
                        }
                    }, (error) => {
                        if (error) {
                            logger.error(error);
                        }
                        next(null, activityResponse, contractOwnerResponse);
                    });
                }
            } else {
                next(null, activityResponse, contractOwnerResponse);
            }
        }, (activityResponse, contractOwnerResponse, next) => {
            if (contractOwnerResponse) {
                const msg = templateUtil.msgExecuteContractMintONFTMsg.ownerMsg.fmt({
                    ACTIVITYNFT_IDID: activityResponse.nft_id
                });
                const url = templateUtil.msgExecuteContractMintONFTMsg.url.fmt({
                    ACTIVITYNFT_IDID: activityResponse.nft_id
                });
                if (activityResponse.nsfw) {
                    const previewUrl = 'https://f4.omniflix.market/assets/logos/og_image.png';
                    botHelper.sendPhotos([contractOwnerResponse], previewUrl, {
                        caption: msg,
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: 'View on Omniflix Market', url: url }]
                            ]
                        }
                    }, (error) => {
                        if (error) {
                        logger.error(error);
                        }
                        next(null, activityResponse);
                    });
                } else {
                    botHelper.sendMessages([contractOwnerResponse], msg, {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: 'View on Omniflix Market', url: url }]
                            ]
                        }
                    }, (error) => {
                        if (error) {
                            logger.error(error);
                        }
                        next(null, activityResponse);
                    });
                }
            } else {
                next(null, activityResponse);
            }
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

const executeContractMinterContractMintHelper = (activity) => {
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
                isSubscribe: true,
                omniflixAddress: activityResponse.recipient
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, activityResponse, result.userId);
                } else {
                    next(null, activityResponse, null);
                }
            })
        }, (activityResponse, userId, next) => {
            if (activityResponse && activityResponse.denom && activityResponse.denom.contract_owner) {
                userDBO.findOne({
                    omniflixAddress: activityResponse.denom.contract_owner
                }, {}, {}, false, (error, result) => {
                    if (error) {
                        next(error);
                    } else if (result) {
                        next(null, activityResponse, userId, result.userId);
                    } else {
                        next(null, activityResponse, userId, null);
                    }
                })
            } else {
                next(null, activityResponse, userId, null);
            }
        }, (activityResponse, userId, contractOwnerResponse, next) => {
            if (!userId && !contractOwnerResponse) {
                activityDBO.findOneAndUpdate({
                    _id: activityResponse._id
                }, {
                    $set: {
                        isNotified: true
                    }
                }, {}, false, (error, result) => {
                    if (error) {
                        next(error);
                    } else if (!result) {
                        next('Failed to update activity!');
                    }
                })
            } else {
                next(null, activityResponse, userId, contractOwnerResponse);
            }
        }, (activityResponse, userId, contractOwnerResponse, next) => {
            if (userId) {
                const msg = templateUtil.executeContractMinterContractMintMsg.message.fmt({
                    ACTIVITYNFT_IDID: activityResponse.nft_id
                });
                const url = templateUtil.executeContractMinterContractMintMsg.url.fmt({
                    ACTIVITYNFT_IDID: activityResponse.nft_id
                });
                if (activityResponse.nsfw) {
                    const previewUrl = 'https://f4.omniflix.market/assets/logos/og_image.png';
                    botHelper.sendPhotos([userId], previewUrl, {
                        caption: msg,
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: 'View on Omniflix Market', url: url }]
                            ]
                        }
                    }, (error) => {
                        if (error) {
                            logger.error(error);
                        }
                        next(null, activityResponse, contractOwnerResponse);
                    });
                } else {
                    botHelper.sendMessages([userId], msg, {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: 'View on Omniflix Market', url: url }]
                            ]
                        }
                    }, (error) => {
                        if (error) {
                            logger.error(error);
                        }
                        next(null, activityResponse, contractOwnerResponse);
                    });
                }
            } else {
                next(null, activityResponse, contractOwnerResponse);
            }
        }, (activityResponse, contractOwnerResponse, next) => {
            if (contractOwnerResponse) {
                const msg = templateUtil.executeContractMinterContractMintMsg.ownerMsg.fmt({
                    ACTIVITYNFT_IDID: activityResponse.nft_id
                });
                const url = templateUtil.executeContractMinterContractMintMsg.url.fmt({
                    ACTIVITYNFT_IDID: activityResponse.nft_id
                });
                if (activityResponse.nsfw) {
                    const previewUrl = 'https://f4.omniflix.market/assets/logos/og_image.png';
                    botHelper.sendPhotos([contractOwnerResponse], previewUrl, {
                        caption: msg,
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: 'View on Omniflix Market', url: url }]
                            ]
                        }
                    }, (error) => {
                        if (error) {
                        logger.error(error);
                        }
                        next(null, activityResponse);
                    });
                } else {
                    botHelper.sendMessages([contractOwnerResponse], msg, {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: 'View on Omniflix Market', url: url }]
                            ]
                        }
                    }, (error) => {
                        if (error) {
                            logger.error(error);
                        }
                        next(null, activityResponse);
                    });
                }
            } else {
                next(null, activityResponse);
            }
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

const executeContractUpdateMinterContractDropHelper = (activity) => {
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
                isSubscribe: true,
                omniflixAddress: activityResponse.recipient
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, activityResponse, result.userId);
                } else {
                    next(null, activityResponse, null);
                }
            })
        }, (activityResponse, userId, next) => {
            if (!userId) {
                activityDBO.findOneAndUpdate({
                    _id: activityResponse._id
                }, {
                    $set: {
                        isNotified: true
                    }
                }, {}, false, (error, result) => {
                    if (error) {
                        next(error);
                    } else if (!result) {
                        next('Failed to update activity!');
                    }
                })
            } else {
                next(null, activityResponse, userId);
            }
        }, (activityResponse, userId, next) => {
            const msg = templateUtil.executeContractUpdateMinterContractDropMsg.message.fmt({
                ACTIVITYNFT_IDID: activityResponse.nft_id
            });
            const url = templateUtil.executeContractUpdateMinterContractDropMsg.url.fmt({
                ACTIVITYNFT_IDID: activityResponse.nft_id
            });
            botHelper.sendMessages([userId], msg, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'View on Omniflix Market', url: url }]
                    ]
                }
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

const executeContractUpdateMinterContractHelper = (activity) => {
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
                isSubscribe: true,
                omniflixAddress: activityResponse.sender
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, activityResponse, result.userId);
                } else {
                    next(null, activityResponse, null);
                }
            })
        }, (activityResponse, userId, next) => {
            if (!userId) {
                activityDBO.findOneAndUpdate({
                    _id: activityResponse._id
                }, {
                    $set: {
                        isNotified: true
                    }
                }, {}, false, (error, result) => {
                    if (error) {
                        next(error);
                    } else if (!result) {
                        next('Failed to update activity!');
                    }
                })
            } else {
                next(null, activityResponse, userId);
            }
        }, (activityResponse, userId, next) => {
            const msg = templateUtil.executeContractUpdateMinterContractMsg.message.fmt({
                ACTIVITYNFT_IDID: activityResponse.nft_id
            });
            const url = templateUtil.executeContractUpdateMinterContractMsg.url.fmt({
                ACTIVITYNFT_IDID: activityResponse.nft_id
            });
            botHelper.sendMessages([userId], msg, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'View on Omniflix Market', url: url }]
                    ]
                }
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

const saveMinterContractHelper = (activity) => {
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
                    next(null, activityResponse, null);
                }
            })
        }, (activityResponse, userId, next) => {
            if (!userId) {
                activityDBO.findOneAndUpdate({
                    _id: activityResponse._id
                }, {
                    $set: {
                        isNotified: true
                    }
                }, {}, false, (error, result) => {
                    if (error) {
                        next(error);
                    } else if (!result) {
                        next('Failed to update activity!');
                    }
                })
            } else {
                next(null, activityResponse, userId);
            }
        }, (activityResponse, userId, next) => {
            const msg = templateUtil.saveMinterContractTemplate.message.fmt({
                CONTRACT_ADDRESS: activityResponse.contract_address
            });
            botHelper.sendMessages([userId], msg, {
                parse_mode: 'Markdown'
            }, (error) => {
                if (error) {
                    logger.error(error);
                }
                next(null);
            });
        }
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    });
}

const executeContractUpdateRoyaltyRatioHelper = (activity) => {
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
                    next(null, activityResponse, null);
                }
            })
        }, (activityResponse, userId, next) => {
            if (!userId) {
                activityDBO.findOneAndUpdate({
                    _id: activityResponse._id
                }, {
                    $set: {
                        isNotified: true
                    }
                }, {}, false, (error, result) => {
                    if (error) {
                        next(error);
                    } else if (!result) {
                        next('Failed to update activity!');
                    }
                })
            } else {
                next(null, activityResponse, userId);
            }
        }, (activityResponse, userId, next) => {
            const msg = templateUtil.executeContractUpdateRoyaltyRatioMsg.message.fmt({
                ACTIVITYNFT_IDID: activityResponse.nft_id
            });
            botHelper.sendMessages([userId], msg, {
                parse_mode: 'Markdown'
            }, (error) => {
                if (error) {
                    logger.error(error);
                }
                next(null);
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

const createMinterContractDropHelper = (activity) => {
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
            if (activityResponse.contract && activityResponse.contract.sender) {
                next(null, activityResponse);
            } else {
                activityDBO.findOneAndUpdate({
                    _id: activityResponse._id
                }, {
                    $set: {
                        isNotified: true
                    }
                }, {}, false, (error, result) => {
                    if (error) {
                        next(error);
                    } else if (!result) {
                        next('Failed to update activity!');
                    }
                })
            }
        }, (activityResponse, next) => {
            userDBO.findOne({
                omniflixAddress: activityResponse.contract.sender
            }, {}, {}, false, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    next(null, activityResponse, result.userId);
                } else {
                    next(null, activityResponse, null);
                }
            })
        }, (activityResponse, userId, next) => {
            const msg = templateUtil.createMinterContractDropMsg.message.fmt({
                CONTRACT_ADDRESS: activityResponse.contract.contract_address
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

const removeMinterContractDropHelper = (activity) => {
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
            if (activityResponse.contract && activityResponse.contract.sender) {
                userDBO.findOne({
                    omniflixAddress: activityResponse.contract.sender
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
            } else {
                logger.error('No sender found!');
                next(null, activityResponse, null);
            }
        }, (activityResponse, userId, next) => {
            const msg = templateUtil.removeMinterContractDropMsg.message.fmt({
                CONTRACT_ADDRESS: activityResponse.contract.contract_address
            });
            botHelper.sendMessages([userId], msg, {
                parse_mode: 'Markdown'
            }, (error) => {
                if (error) {
                    logger.error(error);
                }
                next(null);
            });
        }, (next) => {
            activityDBO.findOneAndUpdate({
                _id: activity._id
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
    executeContractMintONFTHelper,
    executeContractMinterContractMintHelper,
    executeContractUpdateMinterContractDropHelper,
    executeContractUpdateMinterContractHelper,
    saveMinterContractHelper,
    executeContractUpdateRoyaltyRatioHelper,
    createMinterContractDropHelper,
    removeMinterContractDropHelper
}