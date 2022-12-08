// https://omniflix.market/nft/onft1573f151b21b45489584c034c5140ae7


var cron = require('node-cron');
const { userData } = require('../models/user.model');
const dotenv = require('dotenv').config()
const https = require('https')
const { auctionData } = require("../models/auction.model");

let user_chatId = []
let auctionNotificationSend = cron.schedule('20 * * * * *', function () {
    userData.find({
        "isSubscribe": true
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
    })

    auctionData.find({
        "isNotified": false
    },(error, result) => {
        if (error) {
            console.log(error)
        } else if (result && result.length) {
            result.forEach(auction => {
                let msg = `new Auction Listed On MarketPlace.\nClick the below Link \n(https://omniflix.market/nft/${auction.nftId})\nThe Auction is Starting at:\n${new Date(auction.startTime)}\nAnd The Auction is Ending at:\n${new Date(auction.endTime)}`
                user_chatId.forEach(chatid => {
                    let target = `https://api.telegram.org/bot${process.env.token}/sendMessage?chat_id=${chatid}&text=${msg}&parse_mode=markdown`
                    // console.log(target)
                    https.get(target, (res) => {
                        console.log('Auction Telegram Notification sent')
                    })
                    // console.log(auction.nftId)
                    auctionData.findOneAndUpdate({
                        "nftId":auction.nftId,
                        "auctionId":auction.auctionId
                    },{
                        $set:{
                            "isNotified": true,
                        }
                    },async(error) =>{
                        if(error){
                            console.log(error)
                        }
                    })
                })
            })
        } else {
            console.log("no Auction found")
        }
    })
    
});


module.exports = {
    auctionNotificationSend
}