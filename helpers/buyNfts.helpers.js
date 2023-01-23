const dotenv = require('dotenv').config()
const https = require('https')
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.token);

const { userData } = require('../models/user.model');
const { ActivityData } = require("../models/activity.model");
const {buyNftHelperMsg,burnNftHelperMsg,mintONFTHelperMsg} = require("../src/template.js")

String.prototype.fmt = function (hash) {
    var string = this, key; for (key in hash) string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), hash[key]); return string
}


let buyNftHelper = async (activity) => {
    // console.log(activity)
    let user_chatIdBuyer
    let user_omniflixAddressBuyer
    let user_chatIdOwner
    let user_omniflixAddressOwner

    await userData.findOne({
        "isSubscribe": true,
        "omniflixAddress": activity.buyer
    },async(error, result) => {
        if (error) {
            return console.log(error)
        } else if (result) {
           
            user_chatIdBuyer =result.userId
            user_omniflixAddressBuyer =result.omniflixAddress
            
        } else {
            return console.log("Buy Nft Buyer not subscribed")
        }
    }).clone()

    await userData.findOne({
        "isSubscribe": true,
        "omniflixAddress": activity.owner
    },async(error, result)=>{
        if (error) {
            return console.log(error)
        } else if (result) {
            // console.log("aa")
            user_chatIdOwner =result.userId
            user_omniflixAddressOwner=result.omniflixAddress
        } else {
            return console.log("Transfer Nft Owner Not subscribed")
        }
    }).clone()

    // console.log(user_omniflixAddressOwner,user_chatIdOwner,user_omniflixAddressBuyer,user_chatIdBuyer)
    if(user_omniflixAddressOwner !=undefined && user_chatIdOwner != undefined){

        // let msg = ` ***Nft Sold***: (https://omniflix.market/nft/${activity.nft_id.id})`
        let msg = buyNftHelperMsg.NftOwnerMsg.fmt({ ACTIVITYNFT_IDID:activity.nft_id.id})
        let mediaUrl = buyNftHelperMsg.url.fmt({ ACTIVITYNFT_IDID:activity.nft_id.id})

        // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdOwner}&text=${msg}&parse_mode=markdown`
        // https.get(target, (res) => {
        //     return console.log('Buy-Nft Owner Telegram Notification sent')
        // })

        bot.telegram.sendMessage(user_chatIdOwner,msg,{
            parse_mode:'Markdown',
            reply_markup:{
                inline_keyboard:[
                    [
                        {text:"Nft Sold",url:mediaUrl}
                    ]
                ]
            }
        })
        
        ActivityData.findOneAndUpdate({
            "_id":activity._id
        }, {
            $set: {
                "isNotified": true,
            }
        }, async (error) => {
            if (error) {
                return console.log(error)
            }
        })
    }

    if(user_chatIdBuyer != undefined && user_omniflixAddressBuyer != undefined){
        // let msg = ` ***You Bought New NFT*** (https://omniflix.market/nft/${activity.nft_id.id})`
        let msg = buyNftHelperMsg.NftBuyerMsg.fmt({ ACTIVITYNFT_IDID:activity.nft_id.id})
        let mediaUrl = buyNftHelperMsg.url.fmt({ ACTIVITYNFT_IDID:activity.nft_id.id})

        // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdBuyer}&text=${msg}&parse_mode=markdown`
        // https.get(target, (res) => {
        //     return console.log('Buy-Nft Buyer Telegram Notification sent')
        // })

        bot.telegram.sendMessage(user_chatIdBuyer,msg,{
            parse_mode:'Markdown',
            reply_markup:{
                inline_keyboard:[
                    [
                        {text:"You Bought New NFT",url:mediaUrl}
                    ]
                ]
            }
        })

        ActivityData.findOneAndUpdate({
            "_id":activity._id
        }, {
            $set: {
                "isNotified": true,
            }
        }, async (error) => {
            if (error) {
                return console.log(error)
            }
        })
    }
    
}

let burnNftHelper = async (activity) => {
    let user_chatIdOwner
    let user_omniflixAddressOwner

    await userData.findOne({
        "isSubscribe": true,
        "omniflixAddress": activity.denom_id.creator
    }, async (error, result) => {
        if (error) {
            return console.log(error)
        } else if (result) {
            user_chatIdOwner = result.userId
            user_omniflixAddressOwner = result.omniflixAddress

        } else {
            return console.log("Burn ONFT user not subscribed")
        }
    }).clone()

    if (user_omniflixAddressOwner != undefined && user_chatIdOwner != undefined) {
        // let msg = ` *** You Delisting Following Nft From MarketPlace.***
        // (https://omniflix.market/nft/${activity.id})`
        let msg = burnNftHelperMsg.message.fmt({ ACTIVITYID:activity.id})
        let mediaUrl = burnNftHelperMsg.url.fmt({ ACTIVITYID:activity.id})

        // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${user_chatIdOwner}&text=${msg}&parse_mode=markdown`
        // console.log("target", target)
        // https.get(target, (res) => {
        //     return console.log('Burn ONFT Telegram Notification sent')
        // })

        bot.telegram.sendMessage(user_chatIdOwner,msg,{
            parse_mode:'Markdown',
            reply_markup:{
                inline_keyboard:[
                    [
                        {text:"Burned NFT",url:mediaUrl}
                    ]
                ]
            }
        })


        ActivityData.findOneAndUpdate({
            "_id": activity._id
        }, {
            $set: {
                "isNotified": true,
            }
        }, async (error) => {
            if (error) {
                return console.log(error)
            }
        })

    }
}

let mintONFTHelper = async (activity)=>{
    try{
        let id = activity._id;
        // console.log("mingOnftWorking")
        
        // let id = activity;
        let activityData = await ActivityData.findOne({_id:id});
        if(!activityData){
            console.log("Acitivity not found");
        }


        // console.log(activityData.creator)
        let creatorData = await userData.find({
            isSubscribe:true,
            omniflixAddress:activityData.creator
             
        })


        let ownerData = await userData.find({
            isSubscribe:true,
            omniflixAddress:activityData.owner  
        })
        
        let nftId = activityData.id;

        if(creatorData.length){
            creatorData.forEach((data)=>{
                // let msg = `You have minted a new nft, to check %0AClick the below Link %0A(https://omniflix.market/nft/${nftId})`;
                let msg = mintONFTHelperMsg.creatorMsg.fmt({ NFTID:nftId})
                let mediaUrl = mintONFTHelperMsg.url.fmt({ NFTID:nftId})
                let userId = data.userId;
                // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${userId}&text=${msg}&parse_mode=markdown`
                // https.get(target,(res)=>{
                //     console.log("Notification sent");
                // })

                bot.telegram.sendMessage(userId,msg,{
                    parse_mode:'Markdown',
                    reply_markup:{
                        inline_keyboard:[
                            [
                                {text:"Minted New Nft",url:mediaUrl}
                            ]
                        ]
                    }
                })
                
            })
        }


        if(ownerData.length){
            ownerData.forEach((data)=>{
                // let msg = `A new NFT was minted in you account, to check %0AClick the below Link %0A(https://omniflix.market/nft/${nftId})`;
                let msg = mintONFTHelperMsg.ownerMsg.fmt({ NFTID:nftId})
                let mediaUrl = mintONFTHelperMsg.url.fmt({ NFTID:nftId})
                let userId = data.userId;
                // let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${userId}&text=${msg}&parse_mode=markdown`
                // https.get(target,(res)=>{
                //     console.log("Notification sent");
                // })

                bot.telegram.sendMessage(userId,msg,{
                    parse_mode:'Markdown',
                    reply_markup:{
                        inline_keyboard:[
                            [
                                {text:"Minted New Nft",url:mediaUrl}
                            ]
                        ]
                    }
                })
                
            })
        }


        
        await ActivityData.findOneAndUpdate({
            _id:id
            },{
                $set:{
                    isNotified:true
                }
            })
    


    }catch(error){
        console.log(error);
    }
}

module.exports={
    buyNftHelper,
    burnNftHelper,
    mintONFTHelper
}