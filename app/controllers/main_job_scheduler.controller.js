const async = require('async');
const request = require("request")
const cron = require('node-cron');
const activityDBO = require('../dbos/activity.dbo');
const { 
    createAuctionHelper, 
    cancelAuctionHelper, 
    removeAuctionHelper, 
    processBidAuctionHelper, 
    placeBidAuctionHelper 
} = require("../helpers/auction.helper");
const { listingHelper, deListingHelper } = require("../helpers/listing.helper");
const { transferNFTHelper } = require("../helpers/transfer_NFT.helper");
const { 
    buyNFTHelper, 
    burnNFTHelper, 
    mintONFTHelper, 
    burnNFTClaimHelper 
} = require("../helpers/buy_NFT.helper");
const { 
    updateDenomHelper, 
    transferDenomHelper, 
    createDenomHelper 
} = require("../helpers/denom.helper");
const { 
    bulkAuction, 
    bulkListingNft, 
    bulkAuctionCancel, 
    bulkAuctionRemoved, 
    bulkDeListingNft, 
    bulkBurnNft, 
    bulkMinting, 
    bulkTransfer, 
    bulkProcessBid, 
    bulkPlaceBid, 
    bulkBuyNft, 
    bulkUpdateCollection, 
    bulkTransferCollection, 
    bulkCreateCollection, 
    bulkCreateCampaign, 
    bulkCancelCampaign, 
    bulkDepositCampaign, 
    bulkEndCampaign 
} = require("../helpers/bulk_notification.helper");
const { 
    MsgCreateCampaignHelper, 
    MsgCancelCampaignHelper, 
    MsgDepositCampaignHelper, 
    MsgClaimCampaignHelper, 
    endCampaignHelper, 
    campaignTransferNFTHelper, 
    MsgStreamSendHelper, 
    MsgStopStreamHelper, 
    MsgClaimStreamedAmountHelper, 
    MsgStreamCreatedHelper 
} = require("../helpers/campaign.helper");
const { 
    executeContractMintONFTHelper,
    executeContractMinterContractMintHelper,
    executeContractUpdateMinterContractDropHelper,
    executeContractUpdateMinterContractHelper,
    saveMinterContractHelper,
    executeContractUpdateRoyaltyRatioHelper,
    createMinterContractDropHelper,
    removeMinterContractDropHelper,
} = require("../helpers/minter_contract.helper");
const {
    storeCodeHelper,
    instantiateContractHelper,
    executeContractUpdateDenomHelper,
    executeContractCreateDenomHelper,
    executeContractPurgeDenomHelper,
    IBCInCreateDenomHelper,
    IBCInTransferNFTHelper,
} = require("../helpers/contract.helper");
const config = require("../../config");
const logger = require('../../logger');
const { saveWhitelistContractHelper } = require('../helpers/whitelist_contract.helper');


const mainScheduler = () => {
    async.waterfall([
        (next) => {
            const verifiedCollection = []
            const url = `${config.omniflix.datalayerUrl}/collections?sortBy=created_at&order=desc&withNFTs=true&limit=1000`
            const options = { json: true };

            request(url, options, (error, res, body) => {
                if (error) {
                    next(error)
                } else if (!error && res && res.statusCode == 200) {
                    const collections = body.result.list
                    verifiedCollection.splice(0,)
                    collections.forEach(collection => {
                        verifiedCollection.push(collection._id)
                    })
                    next(null, verifiedCollection)
                } else {
                    next("Failed to fetch collections")
                }
            })
        }, (verifiedCollection, next) => {
            activityDBO.find({
                    "isNotified": false
                }, {}, {
                    sort: {
                        created_at: 'desc'
                    },
                }, false, (error, activities) => {
                    if (error) {
                        next(error)
                    } else if (activities && activities.length) {
                        next(null, verifiedCollection, activities);
                    } else {
                        next(new Error("No activities found"))
                    }
                })
        }, (verifiedCollection, activities, next) => {
            async.forEachLimit(activities, 1, (activity, cb) => {
                activityDBO.count({
                    "block": activity.block,
                    "type": activity.type,
                    "isNotified": false,
                }, (error, totalCount) => {
                    if (error) {
                        cb(error)
                    } else if (totalCount > 3) {
                        if (activity.type == "MsgCreateAuction") {
                            bulkAuction(activity, totalCount)
                        } else if (activity.type == "MsgListNFT") {
                            bulkListingNft(activity, totalCount)
                        } else if (activity.type == "MsgCancelAuction") {
                            bulkAuctionCancel(activity, totalCount)
                        } else if (activity.type == "RemoveAuction") {
                            bulkAuctionRemoved(activity, totalCount)
                        } else if (activity.type == "MsgDeListNFT") {
                            bulkDeListingNft(activity, totalCount)
                        } else if (activity.type == "MsgBurnONFT") {
                            bulkBurnNft(activity, totalCount)
                        } else if (activity.type == "MsgMintONFT") {
                            bulkMinting(activity, totalCount)
                        } else if (activity.type == "MsgTransferONFT") {
                            bulkTransfer(activity, totalCount)
                        } else if (activity.type == "ProcessBid") {
                            bulkProcessBid(activity, totalCount)
                        } else if (activity.type == "MsgPlaceBid") {
                            bulkPlaceBid(activity, totalCount)
                        } else if (activity.type == "MsgBuyNFT") {
                            bulkBuyNft(activity, totalCount)
                        } else if (activity.type == "MsgCreateDenom") {
                            bulkCreateCollection(activity, totalCount)
                        } else if (activity.type == "MsgUpdateDenom") {
                            bulkUpdateCollection(activity, totalCount)
                        } else if (activity.type == "MsgTransferDenom") {
                            bulkTransferCollection(activity, totalCount)
                        } else if (activity.type == "MsgCreateCampaign") {
                            bulkCreateCampaign(activity, totalCount)
                        } else if (activity.type == "MsgCancelCampaign") {
                            bulkCancelCampaign(activity, totalCount)
                        } else if (activity.type == "MsgDepositCampaign") {
                            bulkDepositCampaign(activity, totalCount)
                        } else if (activity.type == "EndCampaign") {
                            bulkEndCampaign(activity, totalCount)
                        }
                        cb(null)
                    } else {
                        if (activity.type == "MsgListNFT" || activity.type == "MsgCreateAuction") {
                            const denom = typeof activity.denom_id === 'object' ? activity.denom_id._id : activity.denom_id;
                            if (verifiedCollection.includes(denom)) {
                                if (activity.type == "MsgCreateAuction") {
                                    createAuctionHelper(activity)
                                } else if (activity.type == "MsgListNFT") {
                                    listingHelper(activity)
                                } else if (activity.type == "MsgCancelAuction") {
                                    cancelAuctionHelper(activity)
                                } else if (activity.type == "RemoveAuction") {
                                    removeAuctionHelper(activity)
                                } else if (activity.type == "ProcessBid") {
                                    processBidAuctionHelper(activity)
                                } else if (activity.type == "MsgPlaceBid") {
                                    placeBidAuctionHelper(activity)
                                } else if (activity.type == "MsgTransferONFT") {
                                    transferNFTHelper(activity)
                                } else if (activity.type == "MsgBuyNFT") {
                                    buyNFTHelper(activity)
                                } else if (activity.type == "MsgDeListNFT") {
                                    deListingHelper(activity)
                                } else if (activity.type == "MsgBurnONFT") {
                                    burnNFTHelper(activity)
                                } else if (activity.type == "MsgCreateDenom") {
                                    createDenomHelper(activity)
                                } else if (activity.type == "MsgUpdateDenom") {
                                    updateDenomHelper(activity)
                                } else if (activity.type == "MsgTransferDenom") {
                                    transferDenomHelper(activity)
                                } else if (activity.type == "MsgMintONFT") {
                                    mintONFTHelper(activity)
                                } else if (activity.type == "MsgCreateCampaign") {
                                    MsgCreateCampaignHelper(activity)
                                } else if (activity.type == "MsgCancelCampaign") {
                                    MsgCancelCampaignHelper(activity)
                                } else if (activity.type == "MsgDepositCampaign") {
                                    MsgDepositCampaignHelper(activity)
                                } else if (activity.type == "MsgClaim") {
                                    MsgClaimCampaignHelper(activity)
                                } else if (activity.type == "EndCampaign") {
                                    endCampaignHelper(activity)
                                } else if (activity.type == "TransferNft") {
                                    campaignTransferNFTHelper(activity)
                                } else if (activity.type == "STREAM_PAYMENT_TYPE_CONTINUOUS") {
                                    MsgStreamSendHelper(activity)
                                } else if (activity.type == "STREAM_PAYMENT_TYPE_DELAYED") {
                                    MsgStreamSendHelper(activity)
                                } else if (activity.type == "MsgStopStream") {
                                    MsgStopStreamHelper(activity)
                                } else if (activity.type == "CLAIM") {
                                    MsgClaimStreamedAmountHelper(activity)
                                } else if (activity.type == "BurnNft") {
                                    burnNFTClaimHelper(activity)
                                } else if (activity.type == "StreamCreated") {
                                    MsgStreamCreatedHelper(activity)
                                }
                            } else {
                                logger.error("Collection Not Verified")
                            }
                        } else {
                            if (activity.type == "MsgCreateAuction") {
                                createAuctionHelper(activity)
                            } else if (activity.type == "MsgListNFT") {
                                listingHelper(activity)
                            } else if (activity.type == "MsgCancelAuction") {
                                cancelAuctionHelper(activity)
                            } else if (activity.type == "RemoveAuction") {
                                removeAuctionHelper(activity)
                            } else if (activity.type == "ProcessBid") {
                                processBidAuctionHelper(activity)
                            } else if (activity.type == "MsgPlaceBid") {
                                placeBidAuctionHelper(activity)
                            } else if (activity.type == "MsgTransferONFT") {
                                transferNFTHelper(activity)
                            } else if (activity.type == "MsgBuyNFT") {
                                buyNFTHelper(activity)
                            } else if (activity.type == "MsgDeListNFT") {
                                deListingHelper(activity)
                            } else if (activity.type == "MsgBurnONFT") {
                                burnNFTHelper(activity)
                            } else if (activity.type == "MsgCreateDenom") {
                                createDenomHelper(activity)
                            } else if (activity.type == "MsgUpdateDenom") {
                                updateDenomHelper(activity)
                            } else if (activity.type == "MsgTransferDenom") {
                                transferDenomHelper(activity)
                            } else if (activity.type == "MsgMintONFT") {
                                mintONFTHelper(activity)
                            } else if (activity.type == "MsgCreateCampaign") {
                                MsgCreateCampaignHelper(activity)
                            } else if (activity.type == "MsgCancelCampaign") {
                                MsgCancelCampaignHelper(activity)
                            } else if (activity.type == "MsgDepositCampaign") {
                                MsgDepositCampaignHelper(activity)
                            } else if (activity.type == "MsgClaim") {
                                MsgClaimCampaignHelper(activity)
                            } else if (activity.type == "EndCampaign") {
                                endCampaignHelper(activity)
                            } else if (activity.type == "TransferNft") {
                                campaignTransferNFTHelper(activity)
                            } else if (activity.type == "STREAM_PAYMENT_TYPE_CONTINUOUS") {
                                MsgStreamSendHelper(activity)
                            } else if (activity.type == "STREAM_PAYMENT_TYPE_DELAYED") {
                                MsgStreamSendHelper(activity)
                            } else if (activity.type == "MsgStopStream") {
                                MsgStopStreamHelper(activity)
                            } else if (activity.type == "CLAIM") {
                                MsgClaimStreamedAmountHelper(activity)
                            } else if (activity.type == "BurnNft") {
                                burnNFTClaimHelper(activity)
                            } else if (activity.type == "StreamCreated") {
                                MsgStreamCreatedHelper(activity)
                            } else if (activity.type == "MsgExecuteContractMintONFT") {
                                executeContractMintONFTHelper(activity)
                            } else if (activity.type == "MsgExecuteContractMinterContractMint") {
                                executeContractMinterContractMintHelper(activity)
                            } else if (activity.type == "MsgExecuteContractUpdateMinterContractDrop") {
                                executeContractUpdateMinterContractDropHelper(activity)
                            } else if (activity.type == "MsgStoreCode") {
                                storeCodeHelper(activity)
                            } else if (activity.type == "MsgInstantiateContract") {
                                instantiateContractHelper(activity)
                            } else if (activity.type == "MsgExecuteContractUpdateDenom") {
                                executeContractUpdateDenomHelper(activity)
                            } else if (activity.type == "MsgExecuteContractCreateDenom") {
                                executeContractCreateDenomHelper(activity)
                            } else if (activity.type == "MsgSaveMinterContract") {
                                saveMinterContractHelper(activity)
                            } else if (activity.type == "MsgExecuteContractUpdateMinterContract") {
                                executeContractUpdateMinterContractHelper(activity)
                            } else if (activity.type == "MsgSaveWhitelistContract") {
                                saveWhitelistContractHelper(activity)
                            } else if (activity.type == "MsgExecuteContractPurgeDenom") {
                                executeContractPurgeDenomHelper(activity)
                            } else if (activity.type == "MsgMinterContractUpdateRoyaltyRatio") {
                                executeContractUpdateRoyaltyRatioHelper(activity)
                            } else if (activity.type == "MsgCreateMinterContractDrop") {
                                createMinterContractDropHelper(activity)
                            } else if (activity.type == "IBCInCreateDenom") {
                                IBCInCreateDenomHelper(activity)
                            } else if (activity.type == "MsgIBCTransferNFT") {
                                IBCInTransferNFTHelper(activity)
                            } else if (activity.type == "MsgRemoveMinterContractDrop") {
                                removeMinterContractDropHelper(activity)
                            } else {
                                console.log('Collection Not present', activity.type)
                                // logger.error("No Collection Present")
                            }
                        }
                        cb(null)
                    }
                })
            }, (error) => {
                if (error) {
                    logger.error(error);
                }
            })
        },
    ], (error) => {
        if (error) {
            logger.error(error);
        }
    })
}

const mainSchedulerData = cron.schedule('*/15 * * * * *', mainScheduler)

module.exports = {
    mainSchedulerData
}