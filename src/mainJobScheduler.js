let request = require("request")
var cron = require('node-cron');
const dotenv = require('dotenv').config()
const { ActivityData } = require("../models/activity.model");
const { createAuctionHelper, cancelAuctionHelper, removeAuctionHelper, processBidAuctionHelper, placeBidAuctionHelper } = require("../helpers/auctions.helpers");
const { listingHelper, deListingHelper } = require("../helpers/listings.helpers");
const { transferNftHelper } = require("../helpers/transferNft.helper");
const { buyNftHelper, burnNftHelper, mintONFTHelper } = require("../helpers/buyNfts.helpers");
const { updateDenomHelper, transferDenomHelper, createDenomHelper } = require("../helpers/denoms.helper");
const https = require('https')
const { userData } = require('../models/user.model');
const { bulkAuction, bulkListingNft, bulkAuctionCancel, bulkAuctionRemoved, bulkDeListingNft, bulkBurnNft, bulkMinting, bulkTransfer, bulkProcessBid, bulkPlaceBid, bulkBuyNft, bulkUpdateCollection, bulkTransferCollection, bulkCreateCollection, bulkCreateCampaign, bulkCancelCampaign, bulkDepositCampaign, bulkEndCampaign } = require("../helpers/bulkNotification.helper");
const { MsgCreateCampaignHelper, MsgCancelCampaignHelper, MsgDepositCampaignHelper, endCampaignHelper, campaignTransferNftHelper, MsgStreamSendHelper, MsgStopStreamHelper, MsgClaimStreamedAmountHelper } = require("../helpers/campaigns.helpers");



let MainScheduler = async () => {
    try {
        let verifiedCollection = []
        let url = `${process.env.DATALAYER_COLLECTION_URL}/collections?sortBy=created_at&order=desc&withNFTs=true&verified=true&ipInfringement=false&limit=1000`
        let options = { json: true };

        request(url, options, async (error, res, body) => {
            if (error) {
                return console.log(error)
            } else if (!error && res.statusCode == 200) {
                let collections = body.result.list
                verifiedCollection.splice(0,)
                collections.forEach(collection => {
                    verifiedCollection.push(collection.id)
                })


                await ActivityData.find({
                    "isNotified": false
                }, {}, {
                    sort: {
                        created_at: 'desc'
                    },
                    limit: 1
                }, async (error, activities) => {

                    if (error) {
                        console.log(error)
                    } else if (activities && activities.length) {
                        activities.forEach(async (activity) => {

                            let user_chatId = []
                            await userData.find({
                                "isSubscribe": true,
                            }, async (error, result) => {
                                if (error) {
                                    return console.log(error)
                                } else if (result && result.length) {
                                    user_chatId.splice(0,)
                                    result.forEach(user => {
                                        user_chatId.push(user.userId)
                                    })
                                } else {
                                    return console.log("no User subscribed")
                                }
                            }).clone()
                            await ActivityData.count({
                                "block": activity.block,
                                "type": activity.type,
                                "isNotified": false,

                            }, async (error, totalCount) => {

                                if (error) {
                                    console.log(error)
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
                                    } else if (activity.type == "MsgCreateCampaign") {
                                        bulkCancelCampaign(activity, totalCount)
                                    } else if (activity.type == "MsgCreateCampaign") {
                                        bulkDepositCampaign(activity, totalCount)
                                    } else if (activity.type == "MsgCreateCampaign") {
                                        bulkEndCampaign(activity, totalCount)
                                    }
                                    
                                } else {
                                    if (activity.type == "MsgListNFT" || activity.type == "MsgCreateAuction") {

                                        let denom = activity.denom_id.id ? activity.denom_id.id : activity.denom.id;
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
                                                transferNftHelper(activity)
                                            } else if (activity.type == "MsgBuyNFT") {
                                                buyNftHelper(activity)
                                            } else if (activity.type == "MsgDeListNFT") {
                                                deListingHelper(activity)
                                            } else if (activity.type == "MsgBurnONFT") {
                                                burnNftHelper(activity)
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
                                            } else if (activity.type == "EndCampaign") {
                                                endCampaignHelper(activity)
                                            } else if (activity.type == "TransferNft") {
                                                campaignTransferNftHelper(activity)
                                            } else if (activity.type == "MsgStreamSend") {
                                                MsgStreamSendHelper(activity)
                                            } else if (activity.type == "MsgStopStream") {
                                                MsgStopStreamHelper(activity)
                                            } else if (activity.type == "MsgClaimStreamedAmount") {
                                                MsgClaimStreamedAmountHelper(activity)
                                            }
                                        } else {
                                            return console.log("Collection Not Verified")
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
                                            transferNftHelper(activity)
                                        } else if (activity.type == "MsgBuyNFT") {
                                            buyNftHelper(activity)
                                        } else if (activity.type == "MsgDeListNFT") {
                                            deListingHelper(activity)
                                        } else if (activity.type == "MsgBurnONFT") {
                                            burnNftHelper(activity)
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
                                        } else if (activity.type == "EndCampaign") {
                                            endCampaignHelper(activity)
                                        } else if (activity.type == "TransferNft") {
                                            campaignTransferNftHelper(activity)
                                        } else if (activity.type == "MsgStreamSend") {
                                            MsgStreamSendHelper(activity)
                                        } else if (activity.type == "MsgStopStream") {
                                            MsgStopStreamHelper(activity)
                                        } else if (activity.type == "MsgClaimStreamedAmount") {
                                            MsgClaimStreamedAmountHelper(activity)
                                        }

                                    }
                                }
                            }).clone()

                        })

                    }
                }).clone()
            } else {
                return console.log("No Collection Present")
            }
        })
    } catch (e) {
        console.log(e)
    }
}

let mainSchedulerData = cron.schedule('*/10 * * * * *', MainScheduler)

module.exports = {
    mainSchedulerData
}